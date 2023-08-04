package com.petmeeting.springboot.service;

import com.petmeeting.springboot.dto.answer.AnswerReqDto;
import com.petmeeting.springboot.dto.answer.AnswerResDto;

public interface AnswerService {
    AnswerResDto createAnswer(AnswerReqDto answerReqDto);
    void deleteAnswer(Integer answerNo);
    AnswerResDto getAnswer(Integer inquiryNo);

}
