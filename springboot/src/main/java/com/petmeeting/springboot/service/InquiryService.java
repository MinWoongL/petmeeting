package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Inquiry;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.inquiry.InquiryCreateReqDto;
import com.petmeeting.springboot.dto.inquiry.InquiryResDto;
import com.petmeeting.springboot.dto.inquiry.InquirySearchCondition;
import com.petmeeting.springboot.repository.InquiryQueryDslRepository;
import com.petmeeting.springboot.repository.InquiryRepository;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class InquiryService {
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final InquiryRepository inquiryRepository;
    private final InquiryQueryDslRepository inquiryQueryDslRepository;

    /**
     * 문의게시글 작성
     * 문의게시글 작성 후 작성 결과를 반환
     * @param inquiryCreateReqDto
     * @param token
     * @return InquiryResDto
     */
    @Transactional
    public InquiryResDto createInquiry(InquiryCreateReqDto inquiryCreateReqDto, String token) {
        Integer userNo = jwtUtils.getUserNo(token);
        Users user = userRepository.findById(userNo)
                .orElseThrow(() -> {
                    log.error("[문의게시글 작성] 사용자를 찾을 수 없습니다. userNo : {}", userNo);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
                });

        Inquiry inquiry = Inquiry.builder()
                .user(user)
                .title(inquiryCreateReqDto.getTitle())
                .content(inquiryCreateReqDto.getContent())
                .createdTime(System.currentTimeMillis() / 1000L)
                .status(false)
                .build();

        inquiryRepository.save(inquiry);

        log.info("[문의게시글 작성] 문의게시글 작성. inquiryNo : {}", inquiry.getInquiryNo());
        return InquiryResDto.entityToDto(inquiry);
    }

    /**
     * 문의게시글 상세정보 가져오기
     * @param inquiryNo
     * @return InquiryResDto
     */
    @Transactional
    public InquiryResDto getInquiry(Integer inquiryNo) {
        Inquiry inquiry = inquiryRepository.findById(inquiryNo)
                .orElseThrow(() -> {
                    log.error("[문의게시글 상세정보] 문의게시글을 찾을 수 없습니다. inquiryNo : {}", inquiryNo);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "문의게시글을 찾을 수 없습니다.");
                });

        if (inquiry.getDeletedTime() != null) {
            log.error("[문의게시글 상세정보] 삭제된 게시글입니다.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제된 문의게시글입니다.");
        }

        return InquiryResDto.entityToDto(inquiry);
    }

    /**
     * 문의게시글 목록 가져오기
     * @param inquirySearchCondition
     * @return List<InquiryResDto>
     */
    @Transactional
    public List<InquiryResDto> searchInquiry(InquirySearchCondition inquirySearchCondition) {
        log.info("[문의게시글 검색] 검색조건에 따라 게시글 검색");
        return inquiryQueryDslRepository.findByCondition(inquirySearchCondition).stream()
                .map(inquiry -> InquiryResDto.entityToDto(inquiry))
                .collect(Collectors.toList());
    }


    public void deleteInquiry(Integer inquiryNo, String token) {
    }
}
