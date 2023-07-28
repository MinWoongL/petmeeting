package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.board.*;
import com.petmeeting.springboot.service.BoardService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/board")
public class BoardController {

    private final BoardService boardService;
    private final String ACCESS_TOKEN = "AccessToken";

    @Operation(
            summary = "입양후기 등록",
            description = "후기 등록 후 후기글 고유번호를 반환합니다.\n입양하지 않은 회원은 작성할 수 없습니다."
    )
    @PostMapping
    public ResponseEntity<BoardCreateResDto> createBoard(@RequestBody BoardCreateReqDto boardCreateReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.status(HttpStatus.CREATED).body(boardService.createBoard(boardCreateReqDto, token));
    }

    @Operation(
            summary = "입양후기 상세정보",
            description = "입양후기 상세정보를 반환합니다. viewCnt도 1 증가합니다."
    )
    @GetMapping("/{boardNo}")
    public ResponseEntity<BoardResDto> getBoard(@PathVariable Integer boardNo) {
        return ResponseEntity.ok(boardService.getBoard(boardNo));
    }

    @Operation(
            summary = "입양후기 목록 불러오기",
            description = "입양후기 목록을 불러옵니다."
    )
    @GetMapping
    public ResponseEntity<List<BoardResDto>> getBoardList(BoardSearchCondition searchCondition) {
        return ResponseEntity.ok(boardService.getBoardList(searchCondition));
    }

    @Operation(
            summary = "입양후기 수정",
            description = "입양후기를 수정합니다. 본인 게시글이 아닐 경우 수정 불가"
    )
    @PutMapping("/{boardNo}")
    public ResponseEntity<BoardResDto> updateBoard(@PathVariable Integer boardNo, @RequestBody BoardUpdateReqDto boardUpdateReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.ok(boardService.updateBoard(boardNo, boardUpdateReqDto, token));
    }

    @Operation(
            summary = "입양후기 삭제",
            description = "입양후기를 삭제합니다. 본인 게시글이 아닐 경우 삭제 불가"
    )
    @DeleteMapping("/{boardNo}")
    public ResponseEntity<String> deleteBoard(@PathVariable Integer boardNo, @RequestHeader(ACCESS_TOKEN) String token) {
        boardService.deleteBoard(boardNo, token);
        return ResponseEntity.ok("Delete Success");
    }

    @Operation(
            summary = "입양후기 좋아요",
            description = "입양후기 좋아요를 설정합니다."
    )
    @PostMapping("/like/{boardNo}")
    public ResponseEntity<String> likeBoard(@PathVariable Integer boardNo, @RequestHeader(ACCESS_TOKEN) String token) {
        boardService.likeBoard(boardNo, token);
        return ResponseEntity.ok("Like Success");
    }

    @Operation(
            summary = "입양후기 좋아요 취소",
            description = "입양후기 좋아요를 취소합니다."
    )
    @DeleteMapping("/like/{boardNo}")
    public ResponseEntity<String> dislikeBoard(@PathVariable Integer boardNo, @RequestHeader(ACCESS_TOKEN) String token) {
        boardService.dislikeBoard(boardNo, token);
        return ResponseEntity.ok("Dislike Success");
    }

    @Operation(
            summary = "입양후기 좋아요 체크",
            description = "입양후기가 있는지 체크합니다."
    )
    @GetMapping("/like/{boardNo}")
    public ResponseEntity<Boolean> checkLiked(@PathVariable Integer boardNo, @RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.ok(boardService.checkLiked(boardNo, token));
    }
}
