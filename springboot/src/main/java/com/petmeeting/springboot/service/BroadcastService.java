package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Dog;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.dto.broadcast.BroadcastReqDto;
import com.petmeeting.springboot.dto.broadcast.BroadcastShelterResDto;
import com.petmeeting.springboot.repository.DogRepository;
import com.petmeeting.springboot.repository.ShelterRepository;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class BroadcastService {
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final ShelterRepository shelterRepository;
    private final DogRepository dogRepository;

    /**
     * 기기 제어 요청을 전달합니다.
     * @param token
     * @param endTime
     * @return
     */
    @Transactional
    public Map<String, String> control(String token, long endTime) {
        int userNo = jwtUtils.getUserNo(token);

        log.info("[기기제어 요청] 방송 중인 보호소 불러오기");
        Shelter shelter = shelterRepository.findShelterByOnBroadCastTitleNotNull()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "방송 중인 보호소가 없습니다."));

        if (shelter.getControlEndTime() != null && shelter.getControlEndTime() > System.currentTimeMillis() / 1000L) {
            log.error("[기기제어 요청] Already Controlled");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "이미 조작 중인 사람이 있습니다");
        }

        log.info("[기기제어 요청] 멤버 불러오기");
        Member member = (Member) userRepository.findById(userNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "올바르지 않은 유저입니다."));

        if(member.getHoldingToken() < 1) {
            log.error("[기기제어 요청] Require More than One Token");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "토큰이 부족합니다.");
        }
        member.spendToken(1);
        userRepository.save(member);

        log.info("[기기제어 요청] 기기조작 저장");
        shelter.setControlUser(member.getName(), endTime);
        shelterRepository.save(shelter);

        Map<String, String> map = new HashMap<>();
        map.put("userId", member.getName());
        map.put("remainTime", String.valueOf(endTime - System.currentTimeMillis() / 1000L));

        return map;
    }

    /**
     * 방송 중인 보호소 정보를 가져옵니다
     * @return BroadcastShelterResDto
     */
    public BroadcastShelterResDto getBroadcastShelter() {
        Shelter shelter = shelterRepository.findShelterByOnBroadCastTitleNotNull()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "방송 중인 보호소가 없습니다."));

        if (shelter == null)
            return null;

        log.info("[방송 중 보호소] shelterId : {}", shelter.getId());

        return BroadcastShelterResDto
                .builder()
                .shelterNo(shelter.getId())
                .name(shelter.getName())
                .onBroadcastTitle(shelter.getOnBroadCastTitle())
                .dogNo(shelter.getDogNo())
                .build();
    }

    /**
     * 방송 시작하기
     *
     * @param broadcastReqDto
     */
    @Transactional
    public void startBroadcast(BroadcastReqDto broadcastReqDto, String token) {
        Integer userNo = jwtUtils.getUserNo(token);

        Shelter shelter = shelterRepository.findById(userNo)
                .orElseThrow(() -> {
                    log.error("[방송 시작하기] 해당 보호소를 찾을 수 없습니다. shelterNo : {}", userNo);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "보호소를 찾을 수 없습니다.");
                });

        Dog dog = dogRepository.findDogByDogNo(broadcastReqDto.getDogNo())
                .orElseThrow(() -> {
                    log.error("[방송 시작하기] 해당 유기견을 찾을 수 없습니다. dogNo : {}", broadcastReqDto.getDogNo());
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다.");
                });

        if (!shelter.getId().equals(dog.getShelter().getId())) {
            log.error("[방송 시작하기] 보호소가 등록한 유기견이 아닙니다. DogShelterId : {}, shelterId : {}", dog.getShelter().getId(), shelter.getId());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "해당 보호소가 관리하는 유기견이 아닙니다.");
        }

        log.info("[방송 시작하기] 방송 시작. 방송제목 : {}, 방송유기견 이름 : {}", broadcastReqDto.getOnBroadcastTitle(), dog.getName());
        shelter.startBroadCast(broadcastReqDto.getOnBroadcastTitle(), dog.getDogNo());
        shelterRepository.save(shelter);
    }
}
