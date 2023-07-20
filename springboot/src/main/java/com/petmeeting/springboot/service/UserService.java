package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Member;

public interface UserService {
    Integer signUp(Member member);

    String signIn(Member member);

    String encodingPass(String password);
}