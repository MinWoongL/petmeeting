package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Integer> {
}
