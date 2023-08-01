package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Adoption;
import com.petmeeting.springboot.domain.Dog;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.adoption.AdoptionCreateReqDto;
import com.petmeeting.springboot.dto.adoption.AdoptionResDto;
import com.petmeeting.springboot.dto.adoption.AdoptionUpdateReqDto;
import com.petmeeting.springboot.enums.AdoptionStatus;
import com.petmeeting.springboot.enums.Gender;
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

@Service
@RequiredArgsConstructor
@Slf4j
public class AdoptionService {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final DogRepository dogRepository;
    private final AdoptionRepository adoptionRepository;


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


    @Transactional
    public AdoptionResDto getAdoption(Integer adoptionNo) {

        return null;
    }

    @Transactional
    public AdoptionResDto updateAdoption(Integer adoptionNo, AdoptionUpdateReqDto adoptionUpdateReqDto, String token) {
        Integer userNo = jwtUtils.getUserNo(token);

        // 작성자와 로그인 사용자가 일치해야만 수정 가능
//        if(userNo != )
        return null;
    }


}
