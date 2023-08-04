package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.common.MessageDto;
import com.petmeeting.springboot.dto.common.ResultDto;
import com.petmeeting.springboot.dto.reply.ReplyReqDto;
import com.petmeeting.springboot.dto.reply.ReplyResDto;
import com.petmeeting.springboot.dto.reply.ReplyUpdateReqDto;
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

    @Operation(
            summary = "입양후기 댓글 수정",
            description = "수정 성공 시 댓글 정보를 반환합니다." +
                    "* 댓글작성자와 수정요청자가 같은 경우에만 수정" +
                    "* userNo는 현재 로그인한 유저의 고유번호를 입력합니다."
    )
    @PutMapping("/{replyNo}")
    public ResponseEntity<ReplyResDto> updateReply(@PathVariable Integer replyNo, @RequestBody ReplyUpdateReqDto replyUpdateReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        System.out.println(replyUpdateReqDto.getContent());
        return ResponseEntity.ok(replyService.updateReply(replyNo, replyUpdateReqDto, token));
    }

    @Operation(
            summary = "입양후기 댓글 삭제",
            description = "삭제 성공 시 'Delete Success' 메세지를 반환합니다." +
                    "작성자와 삭제자가 동일한 경우만 삭제가 가능합니다." +
                    "userNo는 현재 로그인한 유저의 고유번호를 입력합니다."
    )
    @DeleteMapping("/{replyNo}")
    public ResponseEntity<MessageDto> deleteReply(@PathVariable Integer replyNo, @RequestHeader(ACCESS_TOKEN) String token) {
        replyService.deleteReply(replyNo, token);
        return ResponseEntity.ok(MessageDto.msg("Delete Success"));
    }

    @Operation(
            summary = "입양후기 댓글 좋아요 ",
            description = "입양후기 댓글 좋아요를 설정합니다."
    )
    @PostMapping("/like/{replyNo}")
    public ResponseEntity<MessageDto> likeReply(@PathVariable Integer replyNo, @RequestHeader(ACCESS_TOKEN) String token) {
        replyService.likeReply(replyNo, token);
        return ResponseEntity.ok(MessageDto.msg("Like Success"));
    }

    @Operation(
            summary = "입양후기 댓글 좋아요 취소",
            description = "입양후기 댓글 좋아요를 취소합니다."
    )
    @DeleteMapping("/like/{replyNo}")
    public ResponseEntity<MessageDto> dislikeReply(@PathVariable Integer replyNo, @RequestHeader(ACCESS_TOKEN) String token) {
        replyService.dislikeReply(replyNo, token);
        return ResponseEntity.ok(MessageDto.msg("Dislike Success"));
    }

    @Operation(
            summary = "입양후기 댓글 좋아요 상태확인(체크)",
            description = "입양후기 댓글에 좋아요가 눌려있는지 체크합니다."
    )
    @GetMapping("/like/{replyNo}")
    public ResponseEntity<ResultDto> checkLiked(@PathVariable Integer replyNo, @RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.ok(ResultDto.result(replyService.checkLiked(replyNo, token)));
    }
}
