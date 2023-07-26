package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.auth.Token;
import com.petmeeting.springboot.dto.user.*;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;


    /**
     * ID 중복체크
     * userId가 null이거나 공백일 경우 BAD_REQUEST 발생
     * @param userId
     * @return true || false
     */
    public Boolean check(String userId) {
        if (userId == null || userId.trim().equals(""))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "아이디를 입력해야합니다.");

        log.info("[아이디 중복체크] userId : {}", userId);
        return !userRepository.existsByUserId(userId);
    }

    /**
     * 회원가입
     * 중복된 아이디가 있을 시 BAD_REQUEST 발생
     * @param signUpReqDto
     * @return userNo
     */
    @Transactional
    public Integer signUp(SignUpReqDto signUpReqDto) {
        if (!check(signUpReqDto.getUserId()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format("%s와 중복된 ID가 존재합니다", signUpReqDto.getUserId()));

        signUpReqDto.setPassword(encodingPass(signUpReqDto.getPassword()));
        Users user = signUpReqDto.toEntity();

        log.info("[유저 등록] userId : {}", user.getUserId());
        return userRepository.save(user).getId();
    }

    /**
     * 로그인
     * 비활성이거나 삭제된 계정일 경우 NOT_FOUND 발생
     * @param signInReqDto
     * @return Token, User Inform
     */
    public Map<String, Object> signIn(SignInReqDto signInReqDto) {
        Users user = userRepository.findUsersByUserId(signInReqDto.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "가입되지 않은 사용자입니다."));

        if (!passwordEncoder.matches(signInReqDto.getPassword(), user.getPassword())) {
            log.error("[로그인] Password Error");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "비밀번호가 일치하지 않습니다.");
        } else if (!user.getIsActivated()) {
            log.error("[로그인] Deactivate Account");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "비활성 상태의 계정입니다.");
        } else if (user.getIsDeleted()) {
            log.error("[로그인] Deleted Account");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제된 계정입니다");
        }

        Token token = jwtUtils.generateAccessAndRefreshTokens(authenticationManager, user.getUserId(), user.getName());

        user.updateRefreshToken(token.getRefreshToken());
        userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", SignInResDto.usersToDto(user));

        log.info("[로그인] userId : {}", user.getUserId());
        return result;
    }

    /**
     * 로그아웃
     * AccessToken을 검증하여 해당 유저의 Refresh Token을 만료시킵니다.
     * @param token
     */
    public void signOut(String token) {
        Users user = getUserByToken(token);

        user.updateRefreshToken(null);
        userRepository.save(user);

        log.info("[로그아웃] userId : {}", user.getUserId());
    }

    /**
     * 회원탈퇴
     * AccessToken을 검증하여 해당 유저의 isDeleted를 true로 변경합니다.
     * @param token
     */
    @Transactional
    public void withdraw(String token) {
        Users user = getUserByToken(token);

        user.withdraw();

        log.info("[회원탈퇴] userId : {}", user.getUserId());
    }

    /**
     * RefreshToken을 검증하여 AccessToken을 재발행합니다.
     * @param refreshToken
     * @return
     */
    public String reissueToken(String refreshToken) {

        if (!refreshToken.startsWith("Bearer ")) {
            log.error("[토큰 검증] Prefix Error");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 요청입니다.");
        }
        refreshToken = refreshToken.substring(7);

        Integer userNo = jwtUtils.getUserNoFromJwtToken(refreshToken);
        Users user = userRepository.findById(userNo).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 요청입니다."));

        if (user.getRefreshToken() == null || !user.getRefreshToken().equals(refreshToken)) {
            log.error("[토큰 재발행] 요청받은 RefreshToken과 저장된 RefreshToken 불일치");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 요청입니다.");
        }

        log.info("[토큰 재발행] AccessToken 재발행 : {}", user.getUserId());
        return jwtUtils.generateAccessToken(authenticationManager, user.getUserId(), user.getName());
    }


    /**
     * 유저 정보 업데이트
     * password를 인증하여 정상일 시 User의 정보를 업데이트합니다.
     * @param updateReqDto
     * @param token
     * @return
     */
    public UserResDto updateUser(UserUpdateReqDto updateReqDto, String token) {
        Users user = getUserByToken(token);

        if (!passwordEncoder.matches(updateReqDto.getPassword(), user.getPassword())) {
            log.error("[유저 정보 수정] 비밀번호가 잘못되었습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "비밀번호가 틀렸습니다");
        }

        // update 로직 필요

        return null;
    }

    private Users getUserByToken(String token) {
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

    public String encodingPass(String password) {
        return passwordEncoder.encode(password);
    }
}
