package com.petmeeting.springboot.service;

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

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;

    private final JwtUtils jwtUtils;

    private final PasswordEncoder passwordEncoder;
    @Override
    public Integer signUp(Member member) {
        member.setPassword(encodingPass(member.getPassword()));

        return userRepository.save(member).getId();
    }

    @Override
    public String signIn(Member member) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(member.getUserId(), member.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return jwt;
    }

    @Override
    public String encodingPass(String password) {
        return passwordEncoder.encode(password);
    }
}
