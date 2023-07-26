package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Dog;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.dto.dog.RegisterDogReqDto;
import com.petmeeting.springboot.dto.dog.RegisterDogResDto;
import com.petmeeting.springboot.repository.DogRepository;
import com.petmeeting.springboot.repository.ShelterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DogService {
    private final DogRepository dogRepository;
    private final ShelterRepository shelterRepository;

    /**
     * 유기견 등록
     * @param registerDogReqDto
     * @return dogNo
     */
    @Transactional
    public Map<String, Object> registerDog(RegisterDogReqDto registerDogReqDto){
        Shelter shelter = shelterRepository.findById(registerDogReqDto.getShelterNo())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "보호소를 찾을 수 없습니다."));

        Dog dog = registerDogReqDto.toEntity(shelter);
        log.info("[유기견 등록] 등록된 갱얼쥐 : ", dog);

        Map<String, Object> result = new HashMap<>();
        result.put("dog", RegisterDogResDto.dogToDto(dog));

        return result;
    }

//    // 유기견 조회
//    private Dog findDogByDogNo(Integer dogNo){
//        return null;
//    }

    // 유기견 수정

//    // 유기견 삭제
//    @Transactional
//    private Boolean deleteDog(Integer dogNo){
//        Dog dog =
//
//
//    }



}
