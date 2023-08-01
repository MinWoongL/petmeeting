package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Integer> {
}
