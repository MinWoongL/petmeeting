package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InquiryRepository extends JpaRepository<Inquiry, Integer> {
}
