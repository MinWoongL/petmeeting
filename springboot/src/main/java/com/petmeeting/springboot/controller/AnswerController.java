package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.answer.AnswerReqDto;
import com.petmeeting.springboot.dto.answer.AnswerResDto;
import com.petmeeting.springboot.dto.common.MessageDto;
import com.petmeeting.springboot.service.AnswerService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/answer")
public class AnswerController {
    private final String ACCESS_TOKEN = "AccessToken";
    private final AnswerService answerService;

    @Operation(
            summary = "문의게시글 답변 작성",
            description = "문의게시글 답변 작성 결과를 반환합니다. 문의게시글 상태도 true(답변완료)로 변경합니다."
    )
    @PostMapping
    public ResponseEntity<AnswerResDto> createAnswer(@RequestBody AnswerReqDto answerReqDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(answerService.createAnswer(answerReqDto));
    }

    @Operation(
            summary = "문의게시글 답변 삭제",
            description = "문의게시글 답변을 삭제합니다."
    )
    @PostMapping("/{answerNo}")
    public ResponseEntity<MessageDto> deleteAnswer(@PathVariable Integer answerNo) {
        answerService.deleteAnswer(answerNo);
        return ResponseEntity.ok(MessageDto.msg("Delete Success"));
    }

    @Operation(
            summary = "문의게시글 답변 상세",
            description = "문의게시글에 달린 답변 정보를 가져옵니다."
    )
    @GetMapping("/{inquiryNo}")
    public ResponseEntity<AnswerResDto> getAnswer(@PathVariable Integer inquiryNo) {
        return ResponseEntity.ok(answerService.getAnswer(inquiryNo));
    }
}
