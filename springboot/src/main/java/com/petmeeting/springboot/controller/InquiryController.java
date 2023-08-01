package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.inquiry.InquiryCreateReqDto;
import com.petmeeting.springboot.dto.inquiry.InquiryResDto;
import com.petmeeting.springboot.dto.inquiry.InquirySearchCondition;
import com.petmeeting.springboot.service.InquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/inquiry")
public class InquiryController {
    private final String ACCESS_TOKEN = "AccessToken";
    private final InquiryService inquiryService;
    @Operation(
            summary = "문의게시글 작성",
            description = "문의게시글 작성 결과를 반환합니다."
    )
    @PostMapping
    public ResponseEntity<InquiryResDto> createInquiry(@RequestBody InquiryCreateReqDto inquiryCreateReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(inquiryService.createInquiry(inquiryCreateReqDto, token));
    }

    @Operation(
            summary = "문의게시글 상세보기",
            description = "문의게시글 상세정보를 반환합니다."
    )
    @GetMapping("/{inquiryNo}")
    public ResponseEntity<InquiryResDto> getInquiry(@PathVariable Integer inquiryNo) {
        return ResponseEntity.ok(inquiryService.getInquiry(inquiryNo));
    }

    @Operation(
            summary = "문의게시글 상세보기",
            description = "문의게시글 상세정보를 반환합니다."
    )
    @GetMapping
    public ResponseEntity<List<InquiryResDto>> getInquiry(@Parameter(description = "") InquirySearchCondition inquirySearchCondition) {
        return ResponseEntity.ok(inquiryService.searchInquiry(inquirySearchCondition));
    }
}
