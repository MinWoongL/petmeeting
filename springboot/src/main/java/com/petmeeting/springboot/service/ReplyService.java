package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Reply;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.reply.ReplyReqDto;
import com.petmeeting.springboot.dto.reply.ReplyResDto;
import com.petmeeting.springboot.dto.reply.ReplyUpdateReqDto;
import com.petmeeting.springboot.repository.BoardRepository;
import com.petmeeting.springboot.repository.ReplyRepository;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
                        .writer(reply.getUser().getUserId())
                        .content(reply.getContent())
                        .createTime(reply.getCreatedTime())
                        .modifiedTime(reply.getModifiedTime())
                        .likeCnt(reply.getLikeCnt())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 입양후기 댓글 수정
     * 작성자와 수정자가 일치하지 않으면 수정 불가능 / 삭제된 댓글일 경우 불가능
     * @param replyNo
     * @param replyUpdateReqDto
     * @param token
     * @return
     */
    @Transactional
    public ReplyResDto updateReply(Integer replyNo, ReplyUpdateReqDto replyUpdateReqDto, String token) {
        int userNo = jwtUtils.getUserNo(token);

        Reply reply = replyRepository.findById(replyNo)
                .orElseThrow(() -> {
                    log.error("[입양후기 댓글 수정] 댓글을 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다.");
                });

        if(reply.getDeletedTime() != null) {
            log.error("[입양후기 댓글 수정] 삭제된 댓글입니다.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제된 댓글입니다.");
        };

        if(!reply.getUser().getId().equals(userNo)) {
            log.error("[입양후기 댓글 수정] 작성자와 수정자가 일치하지 않습니다. ReplyUser : {}, loginUser : {}", reply.getUser().getId(), userNo);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자와 수정자가 일치하지 않습니다.");
        };

        reply.updateReply(replyUpdateReqDto);
        replyRepository.save(reply);

        log.info("[입양후기 댓글 수정] 댓글 수정완료~ ");

        return ReplyResDto.builder().build().entityToDto(reply);
    }



}
