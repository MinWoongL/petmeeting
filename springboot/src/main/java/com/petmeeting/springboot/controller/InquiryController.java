package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.common.MessageDto;
import com.petmeeting.springboot.dto.inquiry.InquiryReqDto;
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
    public ResponseEntity<InquiryResDto> createInquiry(@RequestBody InquiryReqDto inquiryReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(inquiryService.createInquiry(inquiryReqDto, token));
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
            summary = "문의게시글 목록 보기",
            description = "검색조건에 따라 문의게시글 목록이 반환됩니다.\n" +
                    "option : all or null (page나 max에 관계없이 모든 게시글 반환)\n" +
                    "max : 최대페이지 수\n" +
                    "page : 해당 페이지\n" +
                    "title : 해당 제목을 포함하는 게시글"
    )
    @GetMapping
    public ResponseEntity<List<InquiryResDto>> getInquiry(@Parameter InquirySearchCondition inquirySearchCondition) {
        return ResponseEntity.ok(inquiryService.searchInquiry(inquirySearchCondition));
    }

    @Operation(
            summary = "문의게시글 수정",
            description = "문의게시글을 수정합니다."
    )
    @PutMapping("/{inquiryNo}")
    public ResponseEntity<InquiryResDto> updateInquiry
            (@PathVariable Integer inquiryNo, @RequestBody InquiryReqDto inquiryReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.ok(inquiryService.updateInquiry(inquiryNo, inquiryReqDto, token));
    }

    @Operation(
            summary = "문의게시글 삭제",
            description = "문의게시글을 삭제합니다."
    )
    @DeleteMapping("/{inquiryNo}")
    public ResponseEntity<MessageDto> deleteInquiry(@PathVariable Integer inquiryNo, @RequestHeader(ACCESS_TOKEN) String token) {
        inquiryService.deleteInquiry(inquiryNo, token);
        return ResponseEntity.ok(MessageDto.msg("Delete Success"));
    }
}
