package com.petmeeting.springboot.dto.reply;

import com.petmeeting.springboot.domain.Reply;
import com.petmeeting.springboot.domain.Users;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReplyResDto {

    Integer replyNo;
    Integer boardNo;
    Integer userNo;
    String writer;
    String content;
    Long createdTime;
    Long modifiedTime;
    Integer likeCnt;

    public static ReplyResDto entityToDto(Reply reply) {
        Users user = reply.getUser();

        return ReplyResDto.builder()
                .replyNo(reply.getReplyNo())
                .boardNo(reply.getBoard().getBoardNo())
                .userNo(user.getId())
                .writer(user.getUserId())
                .content(reply.getContent())
                .createdTime(reply.getCreatedTime())
                .modifiedTime(reply.getModifiedTime())
                .likeCnt(reply.getLikeCnt())
                .build();
    }

}
