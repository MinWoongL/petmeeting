package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Charge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ChargeRepository extends JpaRepository<Charge, Integer> {
    @Query(value = "SELECT SUM(charge.chargeValue) FROM Charge charge WHERE charge.member.id = :userNo")
    Optional<Integer> findSumByUserNo(Integer userNo);
}
