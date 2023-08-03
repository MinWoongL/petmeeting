package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnswerRepository extends JpaRepository<Answer, Integer> {
    Optional<Answer> findByInquiry_InquiryNo(Integer inquiryNo);
}
