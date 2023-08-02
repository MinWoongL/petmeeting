package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Reply;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.reply.ReplyReqDto;
import com.petmeeting.springboot.dto.reply.ReplyResDto;
import com.petmeeting.springboot.repository.BoardRepository;
import com.petmeeting.springboot.repository.ReplyRepository;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReplyService {

    private final JwtUtils jwtUtils;
    private final ReplyRepository replyRepository;
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;

    /**
     * 입양후기 댓글 작성
     * 등록 성공 시 해당 게시글의 추가된 댓글 목록을 반환
     * @param replyReqDto
     * @param token
     * @return
     */
    @Transactional
    public List<ReplyResDto> createReply(ReplyReqDto replyReqDto, String token) {
        Integer userNo = jwtUtils.getUserNo(token);
        Users user = userRepository.findById(userNo).get();

        log.info("[입양후기 댓글 작성] userNo : {}", userNo);

        Reply reply = Reply.builder()
                .user(user)
                .board(boardRepository.findById(replyReqDto.getBoardNo()).get())
                .content(replyReqDto.getContent())
                .createdTime(System.currentTimeMillis() / 1000L)
                .likeCnt(0)
                .build();

        replyRepository.save(reply);

        log.info("[입양후기 댓글 작성] boardNo : {}, replyNo : {}", reply.getBoard().getBoardNo(), reply.getReplyNo());

        return getAllReplyByBoardNo(replyReqDto.getBoardNo());
    }

    /**
     * 입양후기 댓글 리스트 조회
     * 해당 입양후기글의 댓글 리스트를 불러옵니다.
     * @param boardNo
     * @return
     */
    @Transactional
    public List<ReplyResDto> getAllReplyByBoardNo(Integer boardNo) {
        log.info("[입양후기 댓글 리스트 조회] boardNo : {}번 글의 댓글 리스트 조회", boardNo);
        return replyRepository.findAllByBoard(boardNo).stream()
                .map(reply -> ReplyResDto.builder()
                        .replyNo(reply.getReplyNo())
                        .boardNo(reply.getBoard().getBoardNo())
                        .userNo(reply.getUser().getId())
                        .writer(reply.getUser().getName())
                        .content(reply.getContent())
                        .createTime(reply.getCreatedTime())
                        .modifiedTime(reply.getModifiedTime())
                        .likeCnt(reply.getLikeCnt())
                        .build())
                .collect(Collectors.toList());
    }



}
