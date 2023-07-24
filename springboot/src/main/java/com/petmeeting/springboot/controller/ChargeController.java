package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.charge.ChargeCheckReqDto;
import com.petmeeting.springboot.dto.charge.ChargeCheckResDto;
import com.petmeeting.springboot.dto.charge.ChargeReadyReqDto;
import com.petmeeting.springboot.dto.charge.ChargeReadyResDto;
import com.petmeeting.springboot.service.ChargeService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/charge")
public class ChargeController {
    private final ChargeService chargeService;
    private final String AUTHORIZATION = "AccessToken";
    @Operation(
            summary = "결제페이지 요청",
            description = "사용자와 금액, 성공 및 취소, 실패 시 url을 보내면 tid와 결제창 주소를 반환합니다."
    )
    @GetMapping("/ready")
    public ResponseEntity<ChargeReadyResDto> readyToCharge(ChargeReadyReqDto chargeReadyReqDto, @RequestHeader(AUTHORIZATION) String token) {
        return ResponseEntity.ok(chargeService.ready(chargeReadyReqDto, token));
    }

    @Operation(
            summary = "결제 검증",
            description = "결제 완료 시 tid와 pg_token을 보내면 결제내역을 검증하고 결과를 보내줍니다."
    )
    @PostMapping("/check")
    public ResponseEntity<ChargeCheckResDto> chargeCheck(ChargeCheckReqDto chargeCheckReqDto, @RequestHeader(AUTHORIZATION) String token) {
        return ResponseEntity.ok(chargeService.check(chargeCheckReqDto, token));
    }
}
