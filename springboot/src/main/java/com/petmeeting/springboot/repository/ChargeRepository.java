package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Charge;
import com.petmeeting.springboot.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ChargeRepository extends JpaRepository<Charge, Integer> {
    @Query(value = "SELECT SUM(charge.chargeValue) FROM Charge charge WHERE charge.member = ?1")
    Integer findSumByUserNo(Member member);
}
