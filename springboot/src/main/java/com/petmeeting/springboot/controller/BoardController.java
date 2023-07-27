package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.board.BoardCreateReqDto;
import com.petmeeting.springboot.dto.board.BoardCreateResDto;
import com.petmeeting.springboot.dto.board.BoardResDto;
import com.petmeeting.springboot.dto.board.BoardSearchCondition;
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
            summary = "입양후기 목록 불러오기 / 에러 해결 필요",
            description = "입양후기 목록을 불러옵니다."
    )
    @GetMapping
    public ResponseEntity<List<BoardResDto>> getBoardList(@RequestBody BoardSearchCondition searchCondition) {
        System.out.println(searchCondition.getTitle());
        return ResponseEntity.ok(boardService.getBoardList(searchCondition));
    }
}
