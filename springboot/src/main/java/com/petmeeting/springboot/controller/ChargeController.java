package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.charge.*;
import com.petmeeting.springboot.service.ChargeService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/charge")
public class ChargeController {
    private final ChargeService chargeService;
    private final String ACCESS_TOKEN = "AccessToken";

    @Operation(
            summary = "결제페이지 요청",
            description = "사용자와 금액, 성공 및 취소, 실패 시 url을 보내면 tid와 결제창 주소를 반환합니다."
    )
    @PostMapping("/ready")
    public ResponseEntity<ChargeReadyResDto> readyToCharge(@RequestBody ChargeReadyReqDto chargeReadyReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.ok(chargeService.ready(chargeReadyReqDto, token));
    }

    @Operation(
            summary = "결제 검증",
            description = "결제 완료 시 tid와 pg_token을 보내면 결제내역을 검증하고 결과를 보내줍니다."
    )
    @PostMapping("/check")
    public ResponseEntity<ChargeCheckResDto> chargeCheck(@RequestBody ChargeCheckReqDto chargeCheckReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.ok(chargeService.check(chargeCheckReqDto, token));
    }

    @Operation(
            summary = "사용자의 결제 내역 불러오기",
            description = "로그인한 사용자의 결제 내역을 불러옵니다."
    )
    @GetMapping("/history")
    public ResponseEntity<List<ChargeHistoryResDto>> getChargeHistory(@RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.ok(chargeService.getHistory(token));
    }
}
