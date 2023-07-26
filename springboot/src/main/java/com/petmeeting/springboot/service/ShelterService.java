package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.dto.shelter.ShelterResDto;
import com.petmeeting.springboot.dto.shelter.ShelterSearchCondition;
import com.petmeeting.springboot.repository.ShelterQueryDslRepository;
import com.petmeeting.springboot.repository.ShelterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ShelterService {
    private final ShelterRepository shelterRepository;
    private final ShelterQueryDslRepository shelterQueryDslRepository;

    public ShelterResDto getShelter(Integer shelterNo) {
        log.info("[보호소 아이디로 검색] shelterNo : {}", shelterNo);
        Shelter shelter = shelterRepository.findById(shelterNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "보호소를 찾을 수 없습니다."));

        if (shelter.getIsDeleted()) {
            log.error("[보호소 아이디로 검색] Deleted Shelter");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "탈퇴한 보호소입니다.");
        }

        return ShelterResDto.builder()
                .name(shelter.getName())
                .phoneNumber(shelter.getPhoneNumber())
                .joinDate(shelter.getJoinDate())
                .imagePath(shelter.getImagePath())
                .location(shelter.getLocation())
                .siteUrl(shelter.getSiteUrl())
                .build();
    }

    /**
     * 모든 보호소 검색
     * 삭제된 보호소는 반환하지 않는다.
     * @return List<ShelterResDto>
     */
    public List<ShelterResDto> getAllShelter() {
        log.info("[보호소 전체 검색] 모든 보호소 검색");
        return shelterRepository.findShelterByIsDeletedFalse().stream()
                .map(shelter -> ShelterResDto.builder()
                        .shelterNo(shelter.getId())
                        .name(shelter.getName())
                        .location(shelter.getLocation())
                        .siteUrl(shelter.getSiteUrl())
                        .imagePath(shelter.getImagePath())
                        .joinDate(shelter.getJoinDate())
                        .phoneNumber(shelter.getPhoneNumber())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 검색 조건으로 보호소 검색
     * @param condition
     * @return List<ShelterResDto>
     */
    public List<ShelterResDto> getShelterByCondition(ShelterSearchCondition condition) {
        log.info("[보호소 검색조건으로 검색] condition : {}", condition.toString());
        return shelterQueryDslRepository.findByCondition(condition).stream()
                .map(shelter -> ShelterResDto.builder()
                        .shelterNo(shelter.getId())
                        .name(shelter.getName())
                        .location(shelter.getLocation())
                        .siteUrl(shelter.getSiteUrl())
                        .imagePath(shelter.getImagePath())
                        .joinDate(shelter.getJoinDate())
                        .phoneNumber(shelter.getPhoneNumber())
                        .build())
                .collect(Collectors.toList());
    }
}
