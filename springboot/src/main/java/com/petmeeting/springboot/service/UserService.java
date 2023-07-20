package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.user.WithdrawReqDto;
import com.petmeeting.springboot.exception.BadRequestException;
import com.petmeeting.springboot.exception.ForbiddenException;
import com.petmeeting.springboot.exception.NotFoundException;
import com.petmeeting.springboot.util.JwtUtils;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;

    private final JwtUtils jwtUtils;

    private final PasswordEncoder passwordEncoder;

    public Integer signUp(Member member) {
        if (check(member.getUserId())) {
            member.setPassword(encodingPass(member.getPassword()));
            return userRepository.save(member).getId();
        } else {
            throw new BadRequestException(String.format("%s와 중복된 ID가 존재합니다", member.getUserId()));
        }
    }

    public String signIn(Member member) {
        // 삭제되었거나 활성화되지 않은 아이디인지 체크하는거 필요

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(member.getUserId(), member.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return jwt;
    }

    public Boolean check(String userId) {
        return !userRepository.existsByUserId(userId);
    }

    public void withdraw(WithdrawReqDto withdrawReqDto) {
        Optional<Users> users = userRepository.findById(withdrawReqDto.getUserNo());

        Users user = users.orElseThrow(()
                -> new NotFoundException(String.format("%d번 유저가 존재하지 않습니다.", withdrawReqDto.getUserNo())));

        String inputPassword = withdrawReqDto.getPassword();

        if (verifyingPass(inputPassword, user.getPassword())) {
//            회원 삭제 필요

        } else {
            throw new ForbiddenException("비밀번호가 일치하지 않습니다.");
        }
    }

    public boolean verifyingPass(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public String encodingPass(String password) {
        return passwordEncoder.encode(password);
    }
}
