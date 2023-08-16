package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Dog;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.dto.broadcast.BroadcastCheckResDto;
import com.petmeeting.springboot.dto.broadcast.BroadcastReqDto;
import com.petmeeting.springboot.dto.broadcast.BroadcastShelterResDto;
import com.petmeeting.springboot.repository.DogRepository;
import com.petmeeting.springboot.repository.ShelterRepository;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class BroadcastServiceImpl implements BroadcastService {
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final ShelterRepository shelterRepository;
    private final DogRepository dogRepository;

    private final RedisTemplate<String, String> redisTemplate;

    /**
     * 기기 제어 요청을 전달합니다.
     * @param token
     * @param remainTime
     * @return
     */
    @Override
    @Transactional
    public Map<String, String> control(Integer shelterNo, String token, long remainTime) {
        log.info("[기기제어권] 기기제어권 요청. shelterNo : {}, token : {}, remainTime : {}", shelterNo, token, remainTime);
        int userNo = jwtUtils.getUserNo(token);

        log.info("[기기제어권] 방송 중인 보호소 불러오기");
        Shelter shelter = shelterRepository.findShelterByOnBroadCastTitleNotNull()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "방송 중인 보호소가 없습니다."));

        if (!shelter.getId().equals(shelterNo)) {
            log.error("[기기제어권] 방송 중인 보호소가 아닙니다.");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "방송 중인 보호소가 아닙니다.");
        }

        ValueOperations<String, String> vop = redisTemplate.opsForValue();

        if (vop.get("controlUser" + shelter.getId()) != null) {
            log.error("[기기제어권] 이미 조작 중인 사람이 있습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "이미 조작 중인 사람이 있습니다");
        }

        log.info("[기기제어권] 멤버 불러오기");
        Member member = (Member) userRepository.findById(userNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "올바르지 않은 유저입니다."));

        if(member.getHoldingToken() < 1) {
            log.error("[기기제어권] 토큰이 부족합니다.");
            throw new ResponseStatusException(HttpStatus.CONFLICT, "토큰이 부족합니다.");
        }
        member.spendToken(1);
        userRepository.save(member);

        log.info("[기기제어권] 기기조작 요청 저장. controlUser : {}, remainTime : {}", member.getName(), remainTime);
        vop.set("controlUser" + shelter.getId(), String.valueOf(member.getId()), remainTime, TimeUnit.SECONDS);
        vop.set("remainTime" + shelter.getId(), String.valueOf(remainTime + System.currentTimeMillis() / 1000L), remainTime, TimeUnit.SECONDS);

        Map<String, String> map = new HashMap<>();
        map.put("userId", member.getName());
        map.put("remainTime", String.valueOf(remainTime));

        log.info("[기기제어권] 기기조작 요청 완료");
        return map;
    }

    /**
     * 방송 중인 보호소 정보를 가져옵니다
     * @return BroadcastShelterResDto
     */
    @Override
    public BroadcastShelterResDto getBroadcastShelter() {
        log.info("[방송 중 보호소] 방송 중 보호소 정보 요청");

        Shelter shelter = shelterRepository.findShelterByOnBroadCastTitleNotNull()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "방송 중인 보호소가 없습니다."));

        if (shelter == null) {
            log.info("[방송 중 보호소] 방송 중인 보호소가 없습니다.");
            return null;
        }

        log.info("[방송 중 보호소] 방송 중 보호소 정보. shelterId : {}", shelter.getId());

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
    @Override
    @Transactional
    public void startBroadcast(BroadcastReqDto broadcastReqDto, String token) {
        log.info("[방송 시작] 방송 시작 요청. token : {}, {}", token, broadcastReqDto.toString());
        Integer userNo = jwtUtils.getUserNo(token);

        Shelter shelter = shelterRepository.findById(userNo)
                .orElseThrow(() -> {
                    log.error("[방송 시작] 해당 보호소를 찾을 수 없습니다. shelterNo : {}", userNo);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "보호소를 찾을 수 없습니다.");
                });

        Dog dog = dogRepository.findDogByDogNo(broadcastReqDto.getDogNo())
                .orElseThrow(() -> {
                    log.error("[방송 시작] 해당 유기견을 찾을 수 없습니다. dogNo : {}", broadcastReqDto.getDogNo());
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다.");
                });

        if (!shelter.getId().equals(dog.getShelter().getId())) {
            log.error("[방송 시작] 보호소가 등록한 유기견이 아닙니다. DogShelterId : {}, shelterId : {}", dog.getShelter().getId(), shelter.getId());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "해당 보호소가 관리하는 유기견이 아닙니다.");
        }

        log.info("[방송 시작] 방송 시작. 방송제목 : {}, 방송유기견 이름 : {}", broadcastReqDto.getOnBroadcastTitle(), dog.getName());
        shelter.updateBroadCast(broadcastReqDto.getOnBroadcastTitle(), dog.getDogNo());
        shelterRepository.save(shelter);
    }

    @Override
    @Transactional
    public void stopBroadcast(String token) {
        log.info("[방송 종료] 방송 종료 요청. token : {}", token);
        Integer shelterNo = jwtUtils.getUserNo(token);

        Shelter shelter = shelterRepository.findById(shelterNo)
                .orElseThrow(() -> {
                    log.error("[방송 종료] 해당 보호소를 찾을 수 없습니다. shelterNo : {}", shelterNo);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "보호소를 찾을 수 없습니다.");
                });

        shelter.updateBroadCast(null, null);
        shelterRepository.save(shelter);

        log.info("[방송 종료] Redis Data 삭제");
        ValueOperations<String, String> vop = redisTemplate.opsForValue();
        vop.getAndDelete("controlUser" + shelterNo);
        vop.getAndDelete("remainTime" + shelterNo);
        vop.getAndDelete("iot1_toy");
        vop.getAndDelete("iot1_dis");

        log.info("[방송 종료] 방송 종료");
    }

    @Override
    public BroadcastCheckResDto checkControlUser(Integer shelterNo) {
        log.info("[IOT 조작가능 여부 체크] IOT 조작가능 여부 체크 요청. shelterNo : {}", shelterNo);

        Shelter shelter = shelterRepository.findById(shelterNo)
                .orElseThrow(() -> {
                    log.error("[IOT 조작가능 여부 체크] 해당 보호소를 찾을 수 없습니다. shelterNo : {}", shelterNo);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "보호소를 찾을 수 없습니다.");
                });

        ValueOperations<String, String> vop = redisTemplate.opsForValue();

        if (vop.get("remainTime" + shelter.getId()) == null) {
            log.info("[IOT 조작가능 여부 체크] 조작 중인 유저가 없습니다.");
            return BroadcastCheckResDto.builder()
                    .userName(null)
                    .remainTime(null)
                    .build();
        }

        log.info("[IOT 조작가능 여부 체크] 조작 중인 유저가 있습니다. userNo : {}, remainTime : {}", vop.get("controlUser" + shelter.getId()), vop.get("remainTime" + shelter.getId()));
        String userName = userRepository.findById(Integer.valueOf(vop.get("controlUser" + shelter.getId()))).get().getName();
        Long remainTime = Long.parseLong(vop.get("remainTime" + shelter.getId()));

        return BroadcastCheckResDto.builder()
                .userName(userName)
                .remainTime(remainTime - System.currentTimeMillis() / 1000L)
                .build();
    }
}
