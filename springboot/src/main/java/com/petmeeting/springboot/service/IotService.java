package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.iot.IotReqDto;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class IotService {
    private final JwtUtils jwtUtils;

    private final UserRepository userRepository;

    private final RedisTemplate<String, String> redisTemplate;
    public void control(IotReqDto iotReqDto, Integer shelterNo, String token) {
        Integer userNo = jwtUtils.getUserNo(token);

        Users user = userRepository.findById(userNo)
                .orElseThrow(() -> {
                    log.error("[기기 조작] 조작 요청자를 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
                });

        if (user instanceof Shelter && !userNo.equals(shelterNo)) {
            log.error("[기기 조작] 자신의 기기만 조작할 수 있습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "자신의 방송에서만 기기 조작을 할 수 있습니다.");
        }

        Integer command = iotReqDto.getCommand();

        ValueOperations<String, String> vop = redisTemplate.opsForValue();
        Integer controlUserNo = Integer.valueOf(vop.get("controlUser" + shelterNo));
        Long endTime = Long.valueOf(vop.get("remainTime" + shelterNo));

        if (controlUserNo == null || !userNo.equals(controlUserNo)) {
            log.error("[기기 조작] 조작이 허용된 사용자만 조작할 수 있습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "조작이 허용된 사용자만 조작할 수 있습니다.");
        }

        vop.set("iot1_toy", String.valueOf(command), endTime - System.currentTimeMillis() / 1000L, TimeUnit.SECONDS);
    }
}
