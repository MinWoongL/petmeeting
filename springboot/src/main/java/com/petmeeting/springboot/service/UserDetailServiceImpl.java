package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Admin;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.auth.UserDetailsImpl;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        Users user = userRepository.findUsersByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + userId));

        if (user instanceof Member) {
            return UserDetailsImpl.buildFromMember((Member) user);
        } else if (user instanceof Shelter){
            return UserDetailsImpl.buildFromShelter((Shelter) user);
        } else {
            return UserDetailsImpl.buildFromAdmin((Admin) user);
        }
    }
}