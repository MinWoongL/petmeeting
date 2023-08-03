package com.petmeeting.springboot.service;

import com.petmeeting.springboot.dto.broadcast.SseEmitters;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Service
@Slf4j
@RequiredArgsConstructor
public class SseService {
    private final SseEmitters sseEmitters;

    /**
     * SseEmitter를 등록 후 전달합니다.
     * @return SseEmitter
     */
    public SseEmitter connect() {
        log.info("[SSE 등록] SSE 등록 요청");

        SseEmitter sseEmitter = new SseEmitter();
        sseEmitters.add(sseEmitter);

        try {
            sseEmitter.send(SseEmitter.event()
                    .name("connect")
                    .data("connected!"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        log.info("[SSE 등록] SSE 등록 완료");
        return sseEmitter;
    }

    /**
     * SseEmitter로 메시지를 전달합니다.
     * @param userId
     * @param remainTime
     */
    public void sendMessage(String userId, long remainTime) {
        log.info("[SSE 메시지 전송] userId : {}, remainTime : {}", userId, remainTime);
        sseEmitters.sendMessage(userId, remainTime);
    }
}
