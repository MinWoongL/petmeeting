package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.auth.Token;
import com.petmeeting.springboot.dto.user.*;
import com.petmeeting.springboot.repository.ChargeRepository;
import com.petmeeting.springboot.repository.DonationRepository;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final DonationRepository donationRepository;
    private final ChargeRepository chargeRepository;

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    private final RedisTemplate<String, String> redisTemplate;

    @Value("${jwt.refresh_expiration_ms}")
    private long refreshExpirationMs;

    /**
     * ID 중복체크
     * userId가 null이거나 공백일 경우 BAD_REQUEST 발생
     * @param userId
     * @return true || false
     */
    @Override
    public Boolean check(String userId) {
        log.info("[아이디 중복체크] 아이디 중복체크 요청");

        if (userId == null || userId.trim().equals(""))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "아이디를 입력해야합니다.");

        log.info("[아이디 중복체크] 아이디 중복체크 완료. userId : {}", userId);
        return !userRepository.existsByUserId(userId);
    }

    /**
     * 회원가입
     * 중복된 아이디가 있을 시 BAD_REQUEST 발생
     * @param signUpReqDto
     * @return userNo
     */
    @Override
    @Transactional
    public void signUp(SignUpReqDto signUpReqDto) {
        log.info("[회원가입] 회원가입 요청");

        if (!check(signUpReqDto.getUserId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format("%s와 중복된 ID가 존재합니다", signUpReqDto.getUserId()));

        signUpReqDto.setPassword(encodingPass(signUpReqDto.getPassword()));
        Users user = signUpReqDto.toEntity();
        userRepository.save(user);

        log.info("[회원가입] 회원가입 완료. userId : {}", user.getUserId());
    }

    /**
     * 로그인
     * 비활성이거나 삭제된 계정일 경우 NOT_FOUND 발생
     * @param signInReqDto
     * @return Token, User Inform
     */
    @Override
    public Map<String, Object> signIn(SignInReqDto signInReqDto) {
        log.info("[로그인] 로그인 요청");

        Users user = userRepository.findUsersByUserId(signInReqDto.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "가입되지 않은 사용자입니다."));

        if (!passwordEncoder.matches(signInReqDto.getPassword(), user.getPassword())) {
            log.error("[로그인] 비밀번호가 일치하지 않습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "비밀번호가 일치하지 않습니다.");
        } else if (!user.getIsActivated()) {
            log.error("[로그인] 비활성 상태의 계정입니다.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "비활성 상태의 계정입니다.");
        } else if (user.getIsDeleted()) {
            log.error("[로그인] 삭제된 계정입니다.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제된 계정입니다.");
        }

        Token token = jwtUtils.generateAccessAndRefreshTokens(authenticationManager, user.getUserId(), user.getName());

        ValueOperations<String, String> vop = redisTemplate.opsForValue();
        vop.set(user.getId().toString(), token.getRefreshToken(), refreshExpirationMs, TimeUnit.MILLISECONDS);
        log.info("[로그인] RefreshToken Redis에 저장");

        if (user instanceof Member) {
            ((Member) user).setHoldingPoint(chargeRepository.findSumByUserNo(user.getId()).orElse(0)
                    - donationRepository.findSumByUserNo(user.getId()).orElse(0));
            log.info("[로그인] Member Point 불러오기");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", SignInResDto.usersToDto(user));

        log.info("[로그인] 로그인 완료. userId : {}", user.getUserId());
        return result;
    }

    /**
     * 로그아웃
     * AccessToken을 검증하여 해당 유저의 Refresh Token을 만료시킵니다.
     * @param token
     */
    @Override
    public void signOut(String token) {
        log.info("[로그아웃] 로그아웃 요청");
        Users user = getUserByToken(token);

        log.info("[로그아웃] RefreshToken Redis에서 삭제");
        ValueOperations<String, String> vop = redisTemplate.opsForValue();
        vop.getAndDelete(user.getId().toString());

        log.info("[로그아웃] 로그아웃 완료. userId : {}", user.getUserId());
    }

    /**
     * 회원탈퇴
     * AccessToken을 검증하여 해당 유저의 isDeleted를 true로 변경합니다.
     * @param token
     */
    @Override
    @Transactional
    public void withdraw(String token) {
        log.info("[회원탈퇴] 회원탈퇴 요청");
        Users user = getUserByToken(token);

        user.withdraw();

        log.info("[회원탈퇴] 회원탈퇴 완료. userId : {}", user.getUserId());
    }

    /**
     * RefreshToken을 검증하여 AccessToken을 재발행합니다.
     * @param refreshToken
     * @return AccessToken
     */
    @Override
    public String reissueToken(String refreshToken) {
        log.info("[토큰 재발행] 토큰 재발행 요청");

        if (!refreshToken.startsWith("Bearer ")) {
            log.error("[토큰 재발행] Prefix Error");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 요청입니다.");
        }
        refreshToken = refreshToken.substring(7);

        Integer userNo = jwtUtils.getUserNoFromJwtToken(refreshToken);

        log.info("[토큰 재발행] 사용자의 RefreshToken을 불러옵니다. 만료시간을 갱신합니다.");
        ValueOperations<String, String> vop = redisTemplate.opsForValue();
        String redisRefreshToken = vop.getAndExpire(userNo.toString(), refreshExpirationMs, TimeUnit.MILLISECONDS);

        if (redisRefreshToken == null || !redisRefreshToken.equals(refreshToken)) {
            log.error("[토큰 재발행] 요청받은 RefreshToken과 저장된 RefreshToken 불일치");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 요청입니다.");
        }

        Users user = userRepository.findById(userNo)
                        .orElseThrow(() -> {
                            log.error("[토큰 재발행] 사용자를 찾을 수 없습니다.");
                            return new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
                        });

        log.info("[토큰 재발행] AccessToken 재발행 완료 : {}", user.getUserId());
        return jwtUtils.generateAccessToken(authenticationManager, user.getUserId(), user.getName());
    }


    /**
     * 유저 정보 업데이트
     * password를 인증하여 정상일 시 User의 정보를 업데이트합니다.
     * @param updateReqDto
     * @param token
     * @return UserResDto
     */
    @Override
    public UserResDto updateUser(UserUpdateReqDto updateReqDto, String token) {
        log.info("[유저 정보 수정] 유저 정보 수정 요청");

        Users user = getUserByToken(token);

        if (!passwordEncoder.matches(updateReqDto.getPassword(), user.getPassword())) {
            log.error("[유저 정보 수정] 비밀번호가 잘못되었습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "비밀번호가 틀렸습니다");
        }

        log.info("[유저 정보 수정] 수정된 정보 저장.");
        if (user instanceof Shelter)
            ((Shelter) user).updateInfo(updateReqDto);
        else
            user.updateInfo(updateReqDto);

        userRepository.save(user);

        log.info("[유저 정보 수정] 유저 정보 수정 완료. userId : {}", user.getUserId());
        return UserResDto.builder().build()
                .usersToDto(user);
    }

    private Users getUserByToken(String token) {
        log.info("[토큰 검증] token으로 User 반환 요청");

        if (!token.startsWith("Bearer ")) {
            log.error("[토큰 검증] Prefix Error");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prefix가 올바르지 않습니다.");
        }
        token = token.substring(7);

        if (!jwtUtils.validateJwtToken(token)) {
            log.error("[토큰 검증] Validation Error");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 토큰입니다.");
        }

        Integer userNo = jwtUtils.getUserNoFromJwtToken(token);
        return userRepository.findById(userNo).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 유저입니다"));
    }

    private String encodingPass(String password) {
        return passwordEncoder.encode(password);
    }


    /**
     * (관리자) 유저 정보 가져오기
     * @param userNo
     * @return AdminUserResDto
     */
    @Override
    public AdminUserResDto getUser(Integer userNo) {
        log.info("[관리자 - 회원 상세] 회원 상세정보 요청");

        Users user = userRepository.findById(userNo)
                .orElseThrow(() -> {
                    log.error("[관리자 - 회원 상세] 회원을 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "유저를 찾을 수 없습니다.");
                });

        log.info("[관리자 - 회원 상세] 회원 정보 반환. userId : {}", user.getUserId());
        return AdminUserResDto.builder().build()
                .userToDto(user);
    }

    /**
     * (관리자) 유저 목록 가져오기
     * option에 따라 유저 목록을 불러옵니다.
     * null이거나 all : 모든 유저
     * member : 사용자
     * shelter : 보호소
     * disabled-shelter : 비활성 보호소
     * @param option
     * @return List<AdminUserResDto>
     */
    @Override
    public List<AdminUserResDto> getUserList(String option) {
        log.info("[관리자 - 유저목록] 유저 목록 요청");

        if (option == null || option.equals("all")) {
            return userRepository.findAll().stream()
                    .map(users -> AdminUserResDto.builder().build().userToDto(users))
                    .collect(Collectors.toList());
        } else if (option.equals("disabled-shelter")) {
            return userRepository.findShelterUserWithDisabled().stream()
                    .map(users -> AdminUserResDto.builder().build().userToDto(users))
                    .collect(Collectors.toList());
        } else if (option.equals("shelter")) {
            return userRepository.findShelterUser().stream()
                    .map(users -> AdminUserResDto.builder().build().userToDto(users))
                    .collect(Collectors.toList());
        } else {
            return userRepository.findMemberUser().stream()
                    .map(users -> AdminUserResDto.builder().build().userToDto(users))
                    .collect(Collectors.toList());
        }
    }


    /**
     * 관리자 권한으로 사용자 상태 변경
     * @param userNo
     * @param isActivated
     * @return AdminUserResDto
     */
    @Override
    public AdminUserResDto updateStatus(Integer userNo, Boolean isActivated) {
        log.info("[관리자 - 사용자 상태 변경] 사용자 상태 변경 요청");

        Users user = userRepository.findById(userNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유저를 찾을 수 없습니다."));

        user.updateStatus(isActivated);
        userRepository.save(user);

        log.info("[관리자 - 사용자 상태 변경] 사용자 상태 변경 완료. userId : {}", user.getId());
        return AdminUserResDto.builder().build().userToDto(user);
    }


    /**
     * 마이페이지 정보조회
     * 로그인한 사용자의 정보를 스스로 조회합니다.
     * @param token
     * @return
     */
    @Override
    public SignInResDto getUserInMyPage(String token) {
        log.info("[마이페이지 - 정보조회] 정보조회 요청");

        Integer userNo = jwtUtils.getUserNo(token);

        Users user = userRepository.findById(userNo)
                .orElseThrow(() -> {
                    log.error("[마이페이지 - 정보조회] 회원을 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
                });

        if (user instanceof Member) {
            ((Member) user).setHoldingPoint(chargeRepository.findSumByUserNo(user.getId()).orElse(0)
                    - donationRepository.findSumByUserNo(user.getId()).orElse(0));
        }

        log.info("[마이페이지 - 정보조회] 정보 조회 완료. userId : {}", userNo);
        return SignInResDto.usersToDto(user);
    }
}
