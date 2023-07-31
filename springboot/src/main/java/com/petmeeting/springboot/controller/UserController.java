package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.user.*;
import com.petmeeting.springboot.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import nonapi.io.github.classgraph.json.JSONSerializer;
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
    private final String ACCESS_TOKEN = "AccessToken";
    private final String REFRESH_TOKEN = "RefreshToken";

    @Operation(
            summary = "아이디 중복체크",
            description = "사용가능할 시 'true', 불가능할 시 'false'를 반환합니다."
    )
    @GetMapping("/check/{userId}")
    ResponseEntity<Boolean> duplicateCheck(@PathVariable String userId) {
        return ResponseEntity.ok(userService.check(userId));
    }

    @Operation(
            summary = "AccessToken 재발급",
            description = "Access Token 만료 시 Refresh Token으로 Access Token을 재발급 받습니다."
    )
    @GetMapping("/reissue")
    ResponseEntity<String> reIssue(@RequestHeader(REFRESH_TOKEN) String token) {
        return ResponseEntity.status(HttpStatus.OK)
                .header(ACCESS_TOKEN, userService.reissueToken(token))
                .body("Reissue Success");
    }

    @Operation(
            summary = "회원가입",
            description = "성공 시 “SignUp Success” 메시지를 반환합니다."
    )
    @PostMapping("/sign-up")
    public ResponseEntity<String> signUp(@RequestBody SignUpReqDto signUpReqDto){
        userService.signUp(signUpReqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("SignUp Success");
    }

    @Operation(
            summary = "로그인",
            description = "성공 시 JWT와 회원의 정보를 반환합니다."
    )
    @PostMapping("/sign-in")
    public ResponseEntity<SignInResDto> signIn(@RequestBody SignInReqDto requestDto) {
        Map<String, Object> result = userService.signIn(requestDto);

        return ResponseEntity.status(HttpStatus.OK)
                .header("Token", JSONSerializer.serializeObject(result.get("token")))
                .header("Access-Control-Expose-Headers", "token, Content-type")
                .body((SignInResDto) result.get("user"));
    }

    @Operation(
            summary = "로그아웃",
            description = "성공 시 “SignOut Success”메시지를 반환합니다."
    )
    @DeleteMapping("/sign-out")
    public ResponseEntity<String> signOut(@RequestHeader(ACCESS_TOKEN) String token) {
        userService.signOut(token);

        return ResponseEntity.ok("SignOut Success");
    }

    @Operation(
            summary = "회원탈퇴",
            description = "성공 시 “Delete Success”메시지를 반환합니다."
    )
    @DeleteMapping
    public ResponseEntity<String> withdraw(@RequestHeader(ACCESS_TOKEN) String token) {
        userService.withdraw(token);

        return ResponseEntity.ok("Delete Success");
    }

    @Operation(
            summary = "회원정보수정",
            description = "성공 시 변경된 회원의 데이터를 반환합니다."
    )
    @PutMapping
    public ResponseEntity<UserResDto> updateInfo(@RequestBody UserUpdateReqDto updateReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.ok(userService.updateUser(updateReqDto, token));
    }

    @Operation(
            summary = "(관리자) 회원 가져오기",
            description = "UserNo로 회원의 정보를 가져옵니다."
    )
    @GetMapping("/admin/{userNo}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<AdminUserResDto> getUser (@PathVariable Integer userNo) {
        return ResponseEntity.ok(userService.getUser(userNo));
    }

    @Operation(
            summary = "(관리자) 회원 목록 가져오기",
            description = "option에 따라 회원의 목록을 가져옵니다.\n" +
                    "default : all / disabled-shelter : 비활성 보호소 / shelter : 보호소 / member : 사용자"
    )
    @GetMapping("/admin")
    public ResponseEntity<List<AdminUserResDto>> getUserList(@RequestParam String option) {
        return ResponseEntity.ok(userService.getUserList(option));
    }

    @Operation(
            summary = "(관리자) 회원 활성화 상태 변경 / 작업필요",
            description = "성공 시 회원의 변경된 정보를 반환합니다."
    )
    @PutMapping("/admin/{userNo}")
    public ResponseEntity<AdminUserResDto> updateStatus(@PathVariable Integer userNo,@RequestBody AdminUpdateReqDto adminUpdateReqDto) {
        return ResponseEntity.ok(userService.updateStatus(userNo, adminUpdateReqDto.getIsActivated()));
    }


    @Operation(
            summary = "마이페이지 정보 조회",
            description = "로그인한 사용자의 마이페이지 정보를 조회합니다."
    )
    @GetMapping("/{userNo}")
    public ResponseEntity<MypageResDto> getUserInMyPage(@PathVariable Integer userNo, @RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.ok(userService.getUserInMyPage(userNo, token));
    }

}
