package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.donate.DonateHistoryResDto;
import com.petmeeting.springboot.dto.donate.DonateReqDto;
import com.petmeeting.springboot.dto.donate.DonateResDto;
import com.petmeeting.springboot.service.DonateService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/donation")
public class DonationController {
    private final String ACCESS_TOKEN = "AccessToken";
    private final DonateService donateService;

    @Operation(
            summary = "후원하기",
            description = "사용자가 강아지에게 후원합니다. 남은 포인트를 반환받습니다."
    )
    @PostMapping
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<DonateResDto> donateToDog(@RequestBody DonateReqDto donateReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.ok(donateService.donateToDog(donateReqDto, token));
    }

    @Operation(
            summary = "후원 기록 조회",
            description = "1. 사용자의 경우, 해당 사용자의 후원기록을 반환합니다.\n" +
                    "2. 보호소의 경우, 해당 보호소에 후원한 사용자와 금액을 반환합니다."
    )
    @GetMapping
    public ResponseEntity<List<DonateHistoryResDto>> donateToDog(@RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.ok(donateService.donateHistory(token));
    }
}
