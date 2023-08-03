package com.petmeeting.springboot.service;

import com.petmeeting.springboot.dto.user.*;

import java.util.List;
import java.util.Map;

public interface UserService {
    Boolean check(String userId);
    void signUp(SignUpReqDto signUpReqDto);
    Map<String, Object> signIn(SignInReqDto signInReqDto);
    void signOut(String token);
    void withdraw(String token);
    String reissueToken(String refreshToken);
    UserResDto updateUser(UserUpdateReqDto updateReqDto, String token);
    AdminUserResDto getUser(Integer userNo);
    List<AdminUserResDto> getUserList(String option);
    AdminUserResDto updateStatus(Integer userNo, Boolean isActivated);
    SignInResDto getUserInMyPage(String token);

}
