package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Dog;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.dog.DogResDto;
import com.petmeeting.springboot.dto.dog.RegisterDogReqDto;
import com.petmeeting.springboot.dto.dog.RegisterDogResDto;
import com.petmeeting.springboot.repository.DogRepository;
import com.petmeeting.springboot.repository.ShelterRepository;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
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
    private final UserRepository userRepository;

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

    public Map<String, Object> findDog(Integer dogNo, String token) {
//        Users user = userRepository.findById(getUserNo(token))
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "권한이 없습니다."));
//
//        if(user instanceof Member) {
//            user = (Member) user;
//        } else if(user instanceof Shelter) {
//            user = (Shelter) user;
//        }

        Dog dog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다."));

        Map<String, Object> result = new HashMap<>();
        result.put("dog", DogResDto.dogToDto(dog));

        return result;
    }




    @Transactional
    // getDogList 부터 해야함...
    public void deleteDog(Integer dogNo, String token) {
        Shelter shelter = (Shelter) userRepository.findById(getUserNo(token))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "보호소를 찾을 수 없습니다 삭제 권한이 없습니다."));

//        for(Dog dog : shelter.getDogList()){
//            if(dog.getDogNo() == dogNo) {
//                dog.delete();
//            }
//        }
    //같은보호손지 확인
        Dog dog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다."));

        dog.delete();
        dogRepository.save(dog);
    }

    private Integer getUserNo(String token){
        if(!token.startsWith("Bearer ")) {
            log.error("[토큰 검증] Prefix Error");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prefix가 올바르지 않아유");
        }

        token = token.substring(7);

        if(!jwtUtils.validateJwtToken(token)){
            log.error("[토큰 검증] Validation Error");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 토큰입니다.");
        }

        return jwtUtils.getUserNoFromJwtToken(token);
    }

}
