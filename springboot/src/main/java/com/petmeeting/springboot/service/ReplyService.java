package com.petmeeting.springboot.service;

import com.petmeeting.springboot.dto.reply.ReplyReqDto;
import com.petmeeting.springboot.dto.reply.ReplyResDto;
import com.petmeeting.springboot.dto.reply.ReplyUpdateReqDto;

import java.util.List;

public interface ReplyService {
    List<ReplyResDto> createReply(ReplyReqDto replyReqDto, String token);
    List<ReplyResDto> getAllReplyByBoardNo(Integer boardNo);
    ReplyResDto updateReply(Integer replyNo, ReplyUpdateReqDto replyUpdateReqDto, String token);
    void deleteReply(Integer replyNo, String token);
    void likeReply(Integer replyNo, String token);
    void dislikeReply(Integer replyNo, String token);
    Boolean checkLiked(Integer replyNo, String token);
}
