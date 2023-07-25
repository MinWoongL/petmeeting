package com.petmeeting.springboot.dto.broadcast;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SseEmitters {
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter add(SseEmitter sseEmitter) {
        this.emitters.add(sseEmitter);

        sseEmitter.onCompletion(() -> {
            this.emitters.remove(sseEmitter);
        });
        sseEmitter.onTimeout(() -> {
            sseEmitter.complete();
        });

        return sseEmitter;
    }

    public void sendMessage(String userId, long remainTime) {
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                        .name("userId")
                        .data(userId));
                emitter.send(SseEmitter.event()
                        .name("remainTime")
                        .data(remainTime));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }
}
