package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.user.*;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    @Operation(
            summary = "아이디 중복체크",
            description = "사용가능할 시 'true', 불가능할 시 'false'를 반환합니다."
    )
    @GetMapping("/check/{userId}")
    ResponseEntity<Boolean> duplicateCheck(@PathVariable String userId) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.check(userId));
    }


    @Operation(
            summary = "회원가입 / 작업필요",
            description = "성공 시 “Signup Success” 메시지를 반환합니다."
    )
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody SignUpReqDto requestDto){
        userService.signUp(requestDto.toEntity());
        return ResponseEntity.status(HttpStatus.CREATED).body("Signup Success");
    }

    @Operation(
            summary = "로그인 / 작업필요",
            description = "성공 시 회원의 정보를 반환합니다."
    )
    @PostMapping("/signin")
    public ResponseEntity<String> signIn(@RequestBody SignInReqDto requestDto) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.signIn(requestDto.toEntity()));
    }

    @Operation(
            summary = "회원탈퇴 / 작업필요",
            description = "성공 시 “Delete Success”메시지를 반환합니다."
    )
    @DeleteMapping
    public ResponseEntity<String> withdraw(WithdrawReqDto withdrawReqDto) {

        userService.withdraw(withdrawReqDto);

        return ResponseEntity.ok("Delete Success");
    }

    @Operation(
            summary = "회원정보수정 / 작업필요",
            description = "성공 시 변경된 회원의 데이터를 반환합니다."
    )
    @PutMapping
    public ResponseEntity<UserResDto> updateInfo(UpdateReqDto updateReqDto) {
        return ResponseEntity.ok(UserResDto.builder().build());
    }

    @Operation(
            summary = "회원목록 가져오기 / 작업필요",
            description = "(관리자) 성공 시 회원의 목록을 반환합니다."
    )
    @GetMapping("/admin/list")
    public ResponseEntity<?> allUserlist (String option) {
        System.out.println(option);
        return null;
    }


}
