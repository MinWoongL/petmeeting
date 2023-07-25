package com.petmeeting.springboot.service;

import com.petmeeting.springboot.repository.ShelterRepository;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
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

    public Map<String, String> control(Integer shelterNo, Integer userNo, long endTime) {
        Map<String, String> map = new HashMap<>();
        map.put("userId", "testId");
        map.put("remainTime", "500");

        return map;
    }

    private Integer getUserNo(String token) {
        if (!token.startsWith("Bearer ")) {
            log.error("[토큰 검증] Prefix Error");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prefix가 올바르지 않습니다.");
        }
        token = token.substring(7);

        if (!jwtUtils.validateJwtToken(token)) {
            log.error("[토큰 검증] Validation Error");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 토큰입니다.");
        }

        return jwtUtils.getUserNoFromJwtToken(token);
    }
}
