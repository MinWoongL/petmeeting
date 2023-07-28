package com.petmeeting.springboot.dto.board;

import com.petmeeting.springboot.domain.Board;
import com.petmeeting.springboot.domain.Member;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BoardResDto {
    String title;
    String content;
    Integer userNo;
    String writer;
    Long createdTime;
    Long modifiedTime;
    Long deletedTime;
    String imagePath;
    Integer viewCnt;
    Integer likeCnt;

    public BoardResDto entityToDto(Board board) {
        Member member = board.getMember();

        return BoardResDto.builder()
                .title(board.getTitle())
                .content(board.getContent())
                .userNo(member.getId())
                .writer(member.getUserId())
                .createdTime(board.getCreatedTime())
                .modifiedTime(board.getModifiedTime())
                .deletedTime(board.getDeletedTime())
                .imagePath(board.getImagePath())
                .viewCnt(board.getViewCnt())
                .likeCnt(board.getLikeBoardList().size())
                .build();
    }
}
