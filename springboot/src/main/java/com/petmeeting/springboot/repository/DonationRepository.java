package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Donation;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.dto.donate.DonateHistoryProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DonationRepository extends JpaRepository<Donation, Integer> {
    @Query(value = "SELECT SUM(donation.donateValue) FROM Donation donation WHERE donation.member.id = :userNo")
    Optional<Integer> findSumByUserNo(Integer userNo);

    List<Donation> findAllByMember(Member member);

    @Query(value = "SELECT donation.member.id as memberId, donation.shelter.id as shelterId, SUM(donation.donateValue) as donateValue FROM Donation donation WHERE donation.shelter = :shelter GROUP BY donation.member")
    List<DonateHistoryProjection> findAllByShelterId(Shelter shelter);
}
