package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.*;
import com.petmeeting.springboot.dto.dog.DogResDto;
import com.petmeeting.springboot.dto.dog.DogStatusUpdateReqDto;
import com.petmeeting.springboot.dto.dog.RegisterDogReqDto;
import com.petmeeting.springboot.dto.dog.RegisterDogResDto;
import com.petmeeting.springboot.enums.AdoptionAvailability;
import com.petmeeting.springboot.repository.AdoptionRepository;
import com.petmeeting.springboot.repository.DogRepository;
import com.petmeeting.springboot.repository.ShelterRepository;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserRepository userRepository;
    private final AdoptionRepository adoptionRepository;

    private final JwtUtils jwtUtils;

    /**
     * 유기견 등록
     * @param registerDogReqDto
     * @return registerDogResDto
     */
    @Transactional
    public Map<String, Object> registerDog(RegisterDogReqDto registerDogReqDto, String token){
        Shelter shelter = (Shelter) userRepository.findById(getUserNo(token))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "보호소를 찾을 수 없습니다."));

        Dog dog = registerDogReqDto.toEntity(shelter);

        dogRepository.save(dog);

        Map<String, Object> result = new HashMap<>();
        result.put("dog", RegisterDogResDto.dogToDto(dog));

        return result;
    }

    @Transactional
    public Map<String, Object> findDog(Integer dogNo, String token) {
        // 로그인한 사람만 상세볼수있으니까 User인지 확인
        Users user = userRepository.findById(getUserNo(token))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "권한이 없습니다."));

        Dog dog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다."));

        Map<String, Object> result = new HashMap<>();
        result.put("dog", DogResDto.dogToDto(dog));

        return result;
    }

    /**
     * 유기견의 상태를 변경합니다.
     * userNo는 현재 로그인한 유저의 고유번호를 입력합니다.
     * 보호종료 상태로 변경될 시 해당 유기견에게 할당된 모든 입양신청서의 adoptionStatus가 “미채택”으로 변경됩니다.
     * @param dogStatusUpdateReqDto
     * @param token
     * @return
     */
    @Transactional
    public Map<String, Object> updateDogStatus(Integer dogNo, DogStatusUpdateReqDto dogStatusUpdateReqDto, String token){

        Shelter shelter = (Shelter) userRepository.findById(getUserNo(token))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "보호소를 찾을 수 없습니다."));

        Dog updateDog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "강아지를 찾을 수 없습니다."));

        if(shelter.getId() != updateDog.getShelter().getId()){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "수정 권한이 없습니다.");
        }

        updateDog.updateStatus(dogStatusUpdateReqDto.getAdoptionAvailability());
        dogRepository.save(updateDog);

//        // 만약 보호종료 상태가 된다면, 해당 유기견에게 할당된 모든 입양신청서 "미채택"
//        if(dogStatusUpdateReqDto.getAdoptionAvailability().equals(AdoptionAvailability.ADOPT_IMPOSSIBLE)){
//            Adoption adoption = adoptionRepository.updateAdoptionStatus(updateDog.getDogNo());
//            adoptionRepository.save(adoption);
//        }

        Map<String, Object> result = new HashMap<>();
        result.put("dog", DogResDto.dogToDto(updateDog));

        return result;
    }

    @Transactional
    public DogResDto updateDog(Integer dogNo, RegisterDogReqDto registerDogReqDto, String token) {
        Shelter shelter = (Shelter) userRepository.findById(getUserNo(token))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "보호소를 찾을 수 없습니다."));

        Dog updateDog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "강아지를 찾을 수 없습니다."));

        if(shelter.getId() != updateDog.getShelter().getId()){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "수정 권한이 없습니다.");
        }

        updateDog.updateDogInfo(registerDogReqDto);
        dogRepository.save(updateDog);

        return DogResDto.dogToDto(updateDog);
    }

    @Transactional
    public void deleteDog(Integer dogNo, String token) {
        // 유기견부터 찾기
        Dog dog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다."));

        // 1. 로그인 유저가 보호소 유저면서 (X) controller에서할거야
        // 2. 해당 유기견을 등록한 보호소와 동일한지
        Shelter shelter = (Shelter) userRepository.findById(getUserNo(token))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "보호소를 찾을 수 없습니다."));

        if(dog.getShelter().getId() != shelter.getId()){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "권한 없음(해당 보호소의 갱얼쥐가 아님)");
        }

        dog.delete();
        dogRepository.save(dog);
    }

    private Integer getUserNo(String token){
        if(!token.startsWith("Bearer ")) {
            log.error("[토큰 검증] Prefix Error");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prefix가 올바르지 않습니다.");
        }

        token = token.substring(7);

        if(!jwtUtils.validateJwtToken(token)){
            log.error("[토큰 검증] Validation Error");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 토큰입니다.");
        }

        return jwtUtils.getUserNoFromJwtToken(token);
    }

}
