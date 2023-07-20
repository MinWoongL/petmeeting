package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.user.UserSignInRequestDto;
import com.petmeeting.springboot.dto.user.UserSignUpRequestDto;
import com.petmeeting.springboot.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody UserSignUpRequestDto requestDto){
        userService.signUp(requestDto.toEntity());
        return ResponseEntity.ok("User signUp successfully!");
    }

    @PostMapping("/signin")
    public ResponseEntity<String> signIn(@RequestBody UserSignInRequestDto requestDto) {
        return ResponseEntity.ok(userService.signIn(requestDto.toEntity()));
    }
}
