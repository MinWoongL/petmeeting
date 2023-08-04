package com.petmeeting.springboot.service;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface SseService {
    void sendMessage(String userId, long remainTime);
    SseEmitter connect();
}
