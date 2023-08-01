package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Inquiry;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.inquiry.InquiryReqDto;
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
     * @param inquiryReqDto
     * @param token
     * @return InquiryResDto
     */
    @Transactional
    public InquiryResDto createInquiry(InquiryReqDto inquiryReqDto, String token) {
        Integer userNo = jwtUtils.getUserNo(token);
        Users user = userRepository.findById(userNo)
                .orElseThrow(() -> {
                    log.error("[문의게시글 작성] 사용자를 찾을 수 없습니다. userNo : {}", userNo);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
                });

        Inquiry inquiry = Inquiry.builder()
                .user(user)
                .title(inquiryReqDto.getTitle())
                .content(inquiryReqDto.getContent())
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

    /**
     * 문의게시글 삭제
     * @param inquiryNo
     * @param token
     */
    @Transactional
    public void deleteInquiry(Integer inquiryNo, String token) {
        Inquiry inquiry = inquiryRepository.findById(inquiryNo)
                .orElseThrow(() -> {
                    log.error("[문의게시글 삭제] 문의게시글을 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "문의게시글을 찾을 수 없습니다.");
                });

        if (inquiry.getStatus()) {
            log.error("[문의게시글 삭제] 답변이 작성된 게시글입니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "답변이 작성된 게시글은 수정/삭제할 수 없습니다.");
        }

        Users user = userRepository.findById(jwtUtils.getUserNo(token))
                .orElseThrow(() -> {
                    log.error("[문의게시글 삭제] 사용자를 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
                });

        if (!inquiry.getUser().getId().equals(user.getId())) {
            log.error("[문의게시글 삭제] 작성자와 삭제요청자가 일치하지 않습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자와 삭제요청자가 일치하지 않습니다.");
        }

        log.info("[문의게시글 삭제] 문의게시글이 삭제되었습니다. inquiryNo : {}", inquiryNo);
        inquiry.delete();
        inquiryRepository.save(inquiry);
    }

    /**
     * 문의게시글 수정
     * @param inquiryNo
     * @param inquiryReqDto
     * @param token
     * @return InquiryResDto
     */
    @Transactional
    public InquiryResDto updateInquiry(Integer inquiryNo, InquiryReqDto inquiryReqDto, String token) {
        Inquiry inquiry = inquiryRepository.findById(inquiryNo)
                .orElseThrow(() -> {
                    log.error("[문의게시글 수정] 문의게시글을 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "문의게시글을 찾을 수 없습니다.");
                });

        if (inquiry.getStatus()) {
            log.error("[문의게시글 수정] 답변이 작성된 게시글입니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "답변이 작성된 게시글은 수정/삭제할 수 없습니다.");
        }

        Users user = userRepository.findById(jwtUtils.getUserNo(token))
                .orElseThrow(() -> {
                    log.error("[문의게시글 수정] 사용자를 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
                });

        if (!inquiry.getUser().getId().equals(user.getId())) {
            log.error("[문의게시글 수정] 작성자와 수정요청자가 일치하지 않습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자와 수정요청자가 일치하지 않습니다.");
        }

        log.info("[문의게시글 수정] 게시글을 수정합니다. inquiryNo : {}", inquiry.getInquiryNo());
        inquiry.update(inquiryReqDto);
        inquiryRepository.save(inquiry);

        return InquiryResDto.entityToDto(inquiry);
    }
}
