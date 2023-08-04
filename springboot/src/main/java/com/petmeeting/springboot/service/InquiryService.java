package com.petmeeting.springboot.service;

import com.petmeeting.springboot.dto.inquiry.InquiryReqDto;
import com.petmeeting.springboot.dto.inquiry.InquiryResDto;
import com.petmeeting.springboot.dto.inquiry.InquirySearchCondition;

import java.util.List;

public interface InquiryService {
    InquiryResDto createInquiry(InquiryReqDto inquiryReqDto, String token);
    InquiryResDto getInquiry(Integer inquiryNo);
    List<InquiryResDto> searchInquiry(InquirySearchCondition inquirySearchCondition);
    void deleteInquiry(Integer inquiryNo, String token);
    InquiryResDto updateInquiry(Integer inquiryNo, InquiryReqDto inquiryReqDto, String token);

}
