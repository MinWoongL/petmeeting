package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Adoption;
import com.petmeeting.springboot.domain.Dog;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.adoption.*;
import com.petmeeting.springboot.enums.AdoptionAvailability;
import com.petmeeting.springboot.enums.AdoptionStatus;
import com.petmeeting.springboot.enums.Gender;
import com.petmeeting.springboot.repository.AdoptionQueryDslRepository;
import com.petmeeting.springboot.repository.AdoptionRepository;
import com.petmeeting.springboot.repository.DogRepository;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdoptionService {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final DogRepository dogRepository;
    private final AdoptionRepository adoptionRepository;
    private final AdoptionQueryDslRepository adoptionQueryDslRepository;

    /**
     * 입양신청서 작성
     * 멤버가 아닌 회원은 작성 불가넝
     * @param adoptionCreateReqDto
     * @param token
     * @return
     */
    @Transactional
    public AdoptionResDto createAdoption(AdoptionCreateReqDto adoptionCreateReqDto, String token) {
        Integer userNo = jwtUtils.getUserNo(token);
        Users user = userRepository.findById(userNo).get();

        if(!(user instanceof Member)) {
            log.error("[입양신청서 작성] 작성 권한이 없습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "입양신청 권한이 없습니다.");
        }

        Dog dog = dogRepository.findDogByDogNo(adoptionCreateReqDto.getDogNo())
                .orElseThrow(() -> {
                    log.error("[입양신청서 작성] 유기견을 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다.");
                });


        log.info("[입양신청서 작성] userId : {}", user.getUserId());

        Adoption adoption = Adoption.builder()
                .member((Member) user)
                .dog(dog)
                .shelter(dog.getShelter())
                .name(adoptionCreateReqDto.getName())
                .gender(Gender.valueOf(adoptionCreateReqDto.getGender()))
                .age(adoptionCreateReqDto.getAge())
                .callTime(adoptionCreateReqDto.getCallTime())
                .residence(adoptionCreateReqDto.getResidence())
                .job(adoptionCreateReqDto.getJob())
                .petExperience(adoptionCreateReqDto.getPetExperience())
                .additional(adoptionCreateReqDto.getAdditional())
                .adoptionStatus(AdoptionStatus.WAITING)
                .build();

        adoptionRepository.save(adoption);
        return AdoptionResDto.entityToDto(adoption);
    }

    /**
     * 입양신청서 상세조회
     * 작성자 및 해당 보호소만 상세조회가 가능합니다.
     * @param adoptionNo
     * @param token
     * @return
     */
    @Transactional
    public AdoptionResDto getAdoption(Integer adoptionNo, String token) {
        Adoption adoption = adoptionRepository.findById(adoptionNo)
                .orElseThrow(() -> {
                    log.error("[입양신청서 상세조회] 입양신청서를 가져올 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "입양신청서를 가져올 수 없습니다.");
                });

        Integer userNo = jwtUtils.getUserNo(token);

        // 작성자이거나 해당 보호소일때만 반환
        if(!(userNo.equals(adoption.getMember().getId()) || userNo.equals(adoption.getShelter().getId()))) {
            log.error("[입양신청서 상세조회] 작성자 및 해당 보호소만 상세 조회가 가능합니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "권한이 없습니다.");
        };

        log.info("[입양신청서 상세조회] adoptionNo : {} ", adoptionNo);
        return AdoptionResDto.entityToDto(adoption);
    }

    /**
     * 입양신청서 수정
     * 작성자와 신청자가 일치하지 않으면 수정 불가능
     * @param adoptionNo
     * @param adoptionUpdateReqDto
     * @param token
     * @return
     */
    @Transactional
    public AdoptionResDto updateAdoption(Integer adoptionNo, AdoptionUpdateReqDto adoptionUpdateReqDto, String token) {
        Adoption adoption = adoptionRepository.findById(adoptionNo)
                .orElseThrow(() -> {
                    log.error("[입양신청서 수정] 입양신청서를 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "입양신청서를 찾을 수 없습니다.");
                });

        // 대기중이 아니면 요청 거부
        if(!adoption.getAdoptionStatus().equals(AdoptionStatus.WAITING)) {
            log.error("[입양신청서 수정] 채택/미채택이 완료되어 수정할 수 없습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "수정할 수 없습니다.");
        };

        // 작성자와 로그인 사용자가 일치해야만 수정 가능
        Integer userNo = jwtUtils.getUserNo(token);
        if(!adoption.getMember().getId().equals(userNo)) {
            log.error("[입양신청서 수정] 작성자만 수정할 수 있습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "수정 권한이 없습니다.");
        }

        adoption.updateAdoption(adoptionUpdateReqDto);
        adoptionRepository.save(adoption);

        log.info("[입양신청서 수정] 입양신청서 수정 완료 adoptionNo : {}", adoption.getAdoptionNo());

        return AdoptionResDto.entityToDto(adoption);
    }

    /**
     * 입양신청서 삭제
     * 작성자와 삭제자(로그인 유저)가 일치하지 않으면 삭제 불가능
     * @param adoptionNo
     * @param token
     */
    @Transactional
    public void deleteAdoption(Integer adoptionNo, String token) {
        Integer userNo = jwtUtils.getUserNo(token);

        Adoption adoption = adoptionRepository.findById(adoptionNo)
                .orElseThrow(() -> {
                    log.error("[입양신청서 삭제] 입양신청서를 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "입양신청서를 찾을 수 없습니다.");
                });

        // 작성자 == 로그인사용자
        if(!adoption.getMember().getId().equals(userNo)) {
            log.error("[입양신청서 삭제] 작성자와 로그인사용자가 일치하지 않습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "권한이 없습니다.");
        };

        // adoptStatus 상태가 채택이면 요청 거부
        if(adoption.getAdoptionStatus().equals(AdoptionStatus.ADOPT_SUCCESS)) {
            log.error("[입양신청서 삭제] 채택된 입양신청서는 삭제할 수 없습니다.");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "채택된 입양신청서는 삭제할 수 없습니다.");
        };

        Integer deleteAdoptionCnt = adoptionRepository.deleteAdoptionByAdoptionNo(adoptionNo);
        log.info("[입양신청서 삭제] 입양신청서 삭제 완료. {}개", deleteAdoptionCnt);
    }

    /**
     * 입양신청서 상태 변경
     * @param adoptionNo, adoptStatusUpdateDto, token
     * @return
     */
    @Transactional
    public AdoptionResDto updateAdoptionStatus(Integer adoptionNo, AdoptStatusUpdateReqDto adoptStatusUpdateDto, String token) {
        Integer userNo = jwtUtils.getUserNo(token);

        Adoption adoption = adoptionRepository.findById(adoptionNo)
                .orElseThrow(() -> {
                    log.error("[입양신청서 상태 변경] 입양신청서를 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "입양신청서를 찾을 수 없습니다.");
                });

        // 로그인 유저 == 등록한 보호소
        if(!adoption.getShelter().getId().equals(userNo)) {
            log.error("[입양신청서 상태 변경] 유기견을 등록한 보호소만 수정 가능합니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "수정 권한이 없습니다");
        };

        AdoptionStatus status = AdoptionStatus.valueOf(adoptStatusUpdateDto.getAdoptionStatus());
        Boolean adoptSuccess = adoption.updateAdoptionStatus(status);
        adoptionRepository.save(adoption);
        log.info("[입양신청서 상태 변경] adoption의 상태가 변경되었습니다. {} <- {}", adoption.getAdoptionStatus(), status);

        // "채택"일 때
        if(adoptSuccess) {
            log.info("[입양신청서 상태 변경] 채택일 때");
            Member member = adoption.getMember();
            member.updateAdopted(); // 해당 멤버의 adopted = true
            userRepository.save(member);

            Dog dog = adoption.getDog(); // 해당 유기견의 adoptionAvailability = ADOPT_SUCCESS(입양완료)
            dog.updateStatus(AdoptionAvailability.ADOPT_SUCCESS);
            dogRepository.save(dog);

            // 해당 유기견에게 할당된 모든 입양신청서의 adoptionStatus가 ADOPT_FAIL(미채택)으로 변경
            adoptionRepository.updateAdoptionByDog(dog.getDogNo(), member.getId());
        }

        return AdoptionResDto.entityToDto(adoption);
    }

    /**
     * 입양신청서 검색
     * 로그인 사용자 - 일반인일 경우, 본인이 등록한 신청서 리스트 반환
     * 로그인 사용자 - 보호소일 경우, 보호소에 신청된 신청서 리스트 반환
     * DogNo이 있을 시, 해당 유기견에 관련된 리스트만 반환
     * @param condition
     * @param token
     * @return
     */
    @Transactional
    public List<AdoptionResDto> findAdoptionByCondition(AdoptionSearchCondition condition, String token) {
        Integer userNo = jwtUtils.getUserNo(token);
        Users user = userRepository.findById(userNo)
                .orElseThrow(() -> {
                    log.error("[입양신청서 조건으로 검색] 로그인 상태가 아닙니다.");
                    return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 상태가 아닙니다.");
                });

        log.info("[입양신청서 검색 조건으로 검색] condition : {}", condition.toString());

        return adoptionQueryDslRepository.findByCondition(condition, user).stream()
                .map(adoption -> AdoptionResDto.builder()
                        .adoptionNo(adoption.getAdoptionNo())
                        .memberNo(adoption.getMember().getId())
                        .dogNo(adoption.getDog().getDogNo())
                        .shelterNo(adoption.getShelter().getId())
                        .name(adoption.getName())
                        .gender(adoption.getGender().getValue())
                        .age(adoption.getAge())
                        .callTime(adoption.getCallTime())
                        .residence(adoption.getResidence())
                        .job(adoption.getJob())
                        .petExperience(adoption.getPetExperience())
                        .additional(adoption.getAdditional())
                        .adoptionStatus(adoption.getAdoptionStatus().getValue())
                        .build())
                .collect(Collectors.toList());
    }

}
