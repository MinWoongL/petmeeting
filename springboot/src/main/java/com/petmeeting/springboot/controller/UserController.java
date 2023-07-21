package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.user.*;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    public ResponseEntity<String> signUp(SignUpReqDto signUpReqDto){
        userService.signUp(signUpReqDto.toEntity());
        return ResponseEntity.status(HttpStatus.CREATED).body("Signup Success");
    }

    @Operation(
            summary = "로그인 / 작업필요",
            description = "성공 시 회원의 정보를 반환합니다."
    )
    @PostMapping("/signin")
    public ResponseEntity<String> signIn(SignInReqDto requestDto) {
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
            summary = "(관리자) 회원목록 가져오기 / 작업필요",
            description = "성공 시 option에 따라 회원의 목록을 반환합니다."
    )
    @GetMapping("/admin/userlist")
    public ResponseEntity<Map<String, List<AdminUserResDto>>> getAllUserlist (String option) {

        return null;
    }

    @Operation(
            summary = "(관리자) 비활성상태 보호소 조회 / 작업필요",
            description = "성공 시 비활성상태의 보호소 목록을 반환합니다."
    )
    @GetMapping("/admin/disabled-shelter")
    public ResponseEntity<Map<String, List<AdminUserResDto>>> getAllDisabledShelter() {

        return null;
    }

    @Operation(
            summary = "(관리자) 회원정보 가져오기 / 작업필요",
            description = "성공 시 회원의 정보를 가져옵니다. 보호소의 경우 가입신청서 imageNo도 가져옵니다."
    )
    @GetMapping("/admin/{userNo}")
    public ResponseEntity<AdminUserResDto> getOneUser(@PathVariable Integer userNo) {

        return null;
    }

    @Operation(
            summary = "(관리자) 회원 활성화 상태 변경 / 작업필요",
            description = "성공 시 회원의 변경된 정보를 반환합니다."
    )
    @PutMapping("/admin")
    public ResponseEntity<AdminUserResDto> updateStatus(AdminUpdateReqDto adminUpdateReqDto) {

        return null;
    }
}
