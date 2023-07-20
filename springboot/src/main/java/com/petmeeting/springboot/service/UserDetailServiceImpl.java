package com.petmeeting.springboot.service;

import com.petmeeting.springboot.dto.auth.UserDetailsImpl;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        Member member = (Member) userRepository.findUsersByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + userId));
        return UserDetailsImpl.build(member);
    }
}