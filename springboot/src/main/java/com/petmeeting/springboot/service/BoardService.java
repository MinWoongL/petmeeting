package com.petmeeting.springboot.service;

import com.petmeeting.springboot.dto.board.*;

import java.util.List;

public interface BoardService {
    BoardCreateResDto createBoard(BoardCreateReqDto boardCreateReqDto, String token);
    BoardResDto getBoard(Integer boardNo);
    List<BoardResDto> getBoardList(BoardSearchCondition searchCondition);
    BoardResDto updateBoard(Integer boardNo, BoardUpdateReqDto boardUpdateReqDto, String token);
    void deleteBoard(Integer boardNo, String token);
    void likeBoard(Integer boardNo, String token);
    void dislikeBoard(Integer boardNo, String token);
    Boolean checkLiked(Integer boardNo, String token);
}
