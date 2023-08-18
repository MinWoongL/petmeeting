package com.petmeeting.springboot.dto.answer;

import com.petmeeting.springboot.domain.Answer;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnswerResDto {
    Integer inquiryNo;
    Integer answerNo;
    String content;

    public static AnswerResDto entityToDto(Integer inquiryNo, Answer answer) {
        return AnswerResDto.builder()
                .inquiryNo(inquiryNo)
                .answerNo(answer.getAnswerNo())
                .content(answer.getContent())
                .build();
    }
}
