package com.petmeeting.springboot.dto.broadcast;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
@Slf4j
public class SseEmitters {

    private static final AtomicLong counter = new AtomicLong();

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter add(SseEmitter emitter) {
        this.emitters.add(emitter);
        log.info("new emitter added: {}", emitter);
        log.info("emitter list size: {}", emitters.size());
        log.info("emitter list: {}", emitters);
        emitter.onCompletion(() -> {
            log.info("onCompletion callback");
            this.emitters.remove(emitter);
        });
        emitter.onTimeout(() -> {
            log.info("onTimeout callback");
            emitter.complete();
        });

        return emitter;
    }

    public void count() {
        long count = counter.incrementAndGet();
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                        .name("count")
                        .data(count));
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }
    public void sendMessage(String userId, Long remainTime) {
        emitters.forEach(emitter -> {
            try {
                Map<String, Object> map = new HashMap<>();
                map.put("userId", userId);
                map.put("remainTime", remainTime);

                emitter.send(SseEmitter.event()
                        .name("data")
                        .data(map));
            } catch (Exception e) {
                sendMessage(userId, remainTime); // 실패 시 다시 보내기
            }
        });
    }
}