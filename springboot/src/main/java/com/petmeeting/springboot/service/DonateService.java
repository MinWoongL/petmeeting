package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.*;
import com.petmeeting.springboot.dto.donate.DonateHistoryResDto;
import com.petmeeting.springboot.dto.donate.DonateReqDto;
import com.petmeeting.springboot.dto.donate.DonateResDto;
import com.petmeeting.springboot.repository.*;
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
public class DonateService {

    private final JwtUtils jwtUtils;

    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final ShelterRepository shelterRepository;
    private final DogRepository dogRepository;

    private final ChargeRepository chargeRepository;
    private final DonationRepository donationRepository;

    /**
     * 해당 강아지에게 후원합니다.
     * 후원 후 남은 포인트를 반환합니다.
     * @param donateReqDto
     * @param token
     * @return DonateResDto
     */
    @Transactional
    public DonateResDto donateToDog(DonateReqDto donateReqDto, String token) {
        log.info("[후원] 후원 요청 시작");

        Integer userNo = jwtUtils.getUserNo(token);
        Integer holdingPoint = chargeRepository.findSumByUserNo(userNo).orElse(0) - donationRepository.findSumByUserNo(userNo).orElse(0);

        if (holdingPoint < donateReqDto.getDonationValue()) {
            log.error("[후원] 보유 포인트가 부족합니다. holdingPoint : {}", holdingPoint);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "포인트가 부족합니다.");
        }

        Member member = memberRepository.findById(userNo)
                .orElseThrow(() -> {
                    log.error("[후원] 유저를 찾을 수 없습니다. userNo : {}", userNo);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "회원 정보를 찾을 수 없습니다.");
                });

        Dog dog = dogRepository.findDogByDogNo(donateReqDto.getDogNo())
                .orElseThrow(() -> {
                    log.error("[후원] 유기견 정보를 찾을 수 없습니다. dogNo : {}", donateReqDto.getDogNo());
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견 정보를 찾을 수 없습니다.");
                });

        log.info("[후원] 후원 내역 저장하기");
        Donation donation = Donation.builder()
                .member(member)
                .shelter(dog.getShelter())
                .dog(dog)
                .donateValue(donateReqDto.getDonationValue())
                .donateTime(System.currentTimeMillis() / 1000L)
                .build();

        donationRepository.save(donation);

        log.info("[후원] 후원 완료. 유기견({})에게 {}를 후원했습니다.", dog.getDogNo(), donateReqDto.getDonationValue());
        return DonateResDto.builder()
                .holdingPoint(holdingPoint - donateReqDto.getDonationValue())
                .build();
    }

    @Transactional
    public List<DonateHistoryResDto> donateHistory(String token) {
        log.info("[후원기록 조회] 후원기록 조회 요청");

        Users user = userRepository.findById(jwtUtils.getUserNo(token))
                .orElseThrow(() -> {
                    log.error("[후원기록 조회] 사용자를 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
                });

        if (user instanceof Member) {
            log.info("[후원기록 조회] 사용자의 후원 기록을 조회합니다. userId : {}", user.getUserId());
            return donationRepository.findAllByMember((Member) user).stream()
                    .map(donation -> DonateHistoryResDto.builder()
                            .donationNo(donation.getDonationNo())
                            .dogName(donation.getDog().getName())
                            .shelterName(donation.getShelter().getName())
                            .donationValue(donation.getDonateValue())
                            .donationTime(donation.getDonateTime())
                            .build())
                    .collect(Collectors.toList());

        } else if (user instanceof Shelter) {
            log.info("[후원기록 조회] 보호소의 후원내역을 조회합니다. shelterName : {}", user.getName());
            return donationRepository.findAllByShelterId((Shelter) user).stream()
                    .map(donation -> {
                        Member member = memberRepository.findById(donation.getMemberId()).get();
                        Shelter shelter = shelterRepository.findById(donation.getShelterId()).get();
                        return DonateHistoryResDto.builder()
                                .userId(member.getUserId())
                                .shelterName(shelter.getName())
                                .donateValue(donation.getDonateValue())
                                .build();
                    }).collect(Collectors.toList());
        }
        log.info("[후원기록 조회] token의 유저 정보가 잘못되었습니다.");
        return null;
    }
}
