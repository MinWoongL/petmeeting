package com.petmeeting.springboot.dto.inquiry;

import com.petmeeting.springboot.domain.Inquiry;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InquiryResDto {
    Integer inquiryNo;
    Integer userNo;
    String userName;
    String title;
    String content;
    Long createdTime;
    Long modifiedTime;
    Boolean status;

    public static InquiryResDto entityToDto(Inquiry inquiry) {
        return InquiryResDto.builder()
                .inquiryNo(inquiry.getInquiryNo())
                .userNo(inquiry.getUser().getId())
                .userName(inquiry.getUser().getName())
                .title(inquiry.getTitle())
                .content(inquiry.getContent())
                .createdTime(inquiry.getCreatedTime())
                .modifiedTime(inquiry.getModifiedTime())
                .status(inquiry.getStatus())
                .build();
    }
}
