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
public class IotServiceImpl implements IotService {
    private final JwtUtils jwtUtils;

    private final UserRepository userRepository;

    private final RedisTemplate<String, String> redisTemplate;

    /**
     * 기기조작 명령
     * 기기조작 명령어와 보호소 고유번호, 요청한 유저의 정보를 받아 Redis에 Command를 저장합니다.
     * @param iotReqDto
     * @param shelterNo
     * @param token
     */
    @Override
    public void control(IotReqDto iotReqDto, Integer shelterNo, String token) {
        log.info("[기기조작] 기기조작 요청. {}, shelterNo : {}, token : {}", iotReqDto.toString(), shelterNo, token);

        Integer userNo = jwtUtils.getUserNo(token);

        Users user = userRepository.findById(userNo)
                .orElseThrow(() -> {
                    log.error("[기기조작] 조작 요청자를 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
                });

        ValueOperations<String, String> vop = redisTemplate.opsForValue();
        String controlUser = vop.get("controlUser" + shelterNo);
        String endTime = vop.get("remainTime" + shelterNo);

        if (iotReqDto.getCommand() != 2) {
            if (user instanceof Shelter && !userNo.equals(shelterNo)) {
                log.error("[기기조작] (보호소) 자신의 기기만 조작할 수 있습니다.");
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "자신의 방송에서만 기기 조작을 할 수 있습니다.");
            } else if (controlUser == null || !userNo.equals(Integer.valueOf(controlUser))) {
                log.error("[기기조작] (사용자) 조작이 허용된 사용자만 조작할 수 있습니다.");
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "조작이 허용된 사용자만 조작할 수 있습니다.");
            }
        }

        Integer command = iotReqDto.getCommand();
        if (user instanceof Shelter) {
            log.info("[기기조작] (보호소) 기기 조작 명령을 내립니다.");
            vop.set("iot1", String.valueOf(command), 2, TimeUnit.SECONDS);
        } else {
            log.info("[기기조작] (사용자) 기기 조작 명령을 내립니다.");
            vop.set("iot1", String.valueOf(command), Long.valueOf(endTime) - System.currentTimeMillis() / 1000L, TimeUnit.SECONDS);
        }

    }
}
