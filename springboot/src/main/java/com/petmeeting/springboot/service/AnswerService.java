package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Answer;
import com.petmeeting.springboot.domain.Inquiry;
import com.petmeeting.springboot.dto.answer.AnswerReqDto;
import com.petmeeting.springboot.dto.answer.AnswerResDto;
import com.petmeeting.springboot.repository.AnswerRepository;
import com.petmeeting.springboot.repository.InquiryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Slf4j
@RequiredArgsConstructor
public class AnswerService {

    private final InquiryRepository inquiryRepository;
    private final AnswerRepository answerRepository;

    /**
     * 문의게시글 답변 작성
     * @param answerReqDto
     * @return AnswerResDto
     */
    public AnswerResDto createAnswer(AnswerReqDto answerReqDto) {
        Inquiry inquiry = inquiryRepository.findById(answerReqDto.getInquiryNo())
                .orElseThrow(() -> {
                    log.error("[문의게시글 답변 작성] 문의게시글을 찾을 수 없습니다. inquiryNo : {}", answerReqDto.getInquiryNo());
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "문의게시글을 찾을 수 없습니다.");
                });

        if (inquiry.getStatus()) {
            log.error("[문의게시글 답변 작성] 삭제된 문의게시글입니다. inquireNo : {}", answerReqDto.getInquiryNo());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "삭제된 문의게시글입니다.");
        }

        Answer answer = Answer.builder()
                .content(answerReqDto.getContent())
                .build();

        inquiry.makeAnswer(answer);

        answerRepository.save(answer);
        inquiryRepository.save(inquiry);

        log.info("[문의게시글 답변 작성] 문의게시글에 답변이 작성되었습니다.");
        return AnswerResDto.entityToDto(inquiry.getInquiryNo(), answer);
    }

    /**
     * 문의게시글 답변 삭제 (구현 중)
     * @param answerNo
     */
    @Transactional
    public void deleteAnswer(Integer answerNo) {
        Answer answer = answerRepository.findById(answerNo)
                        .orElseThrow(() -> {

                            return new ResponseStatusException(HttpStatus.NOT_FOUND, "답변을 찾을 수 없습니다.");
                        });

        answerRepository.deleteById(answerNo);
        log.info("[문의게시글 답변 삭제] 문의게시글 답변이 삭제되었습니다. answerNo : {}", answerNo);
    }
}
