package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.reply.ReplyReqDto;
import com.petmeeting.springboot.dto.reply.ReplyResDto;
import com.petmeeting.springboot.service.ReplyService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reply")
public class ReplyController {

    private final ReplyService replyService;
    private final String ACCESS_TOKEN = "AccessToken";

    @Operation(
            summary = "입양후기 댓글(일반, 보호소)",
            description = "등록 성공 시 해당 게시글의 추가된 댓글 목록을 반환합니다."
    )
    @PostMapping
    public ResponseEntity<List<ReplyResDto>> createReply(@RequestBody ReplyReqDto replyReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.status(HttpStatus.CREATED).body(replyService.createReply(replyReqDto, token));
    }

    @Operation(
            summary = "입양후기 댓글 리스트 조회",
            description = "게시글에 있는 댓글 목록을 불러옵니다."
    )
    @GetMapping("/{boardNo}")
    public ResponseEntity<List<ReplyResDto>> getAllReplyByBoardNo(@PathVariable Integer boardNo) {

        return ResponseEntity.ok(replyService.getAllReplyByBoardNo(boardNo));
    }



}
