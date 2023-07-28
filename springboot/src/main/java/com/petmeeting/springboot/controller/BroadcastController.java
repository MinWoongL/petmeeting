package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.broadcast.BroadcastReqDto;
import com.petmeeting.springboot.dto.broadcast.BroadcastShelterResDto;
import com.petmeeting.springboot.dto.common.MessageDto;
import com.petmeeting.springboot.service.BroadcastService;
import com.petmeeting.springboot.service.SseService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/broadcast")
public class BroadcastController {

    private final SseService sseService;
    private final BroadcastService broadcastService;
    private final String ACCESS_TOKEN = "AccessToken";

    private final Long CONTROL_TIME_MS = 300000L; // 5분 설정

    @Operation(
            summary = "SSE 연결",
            description = "방송에 접속한 사용자들과 SSE 통신을 연결합니다."
    )
    @GetMapping(value = "/connection", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> connect() {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("X-Accel-Buffering", "no");
        return ResponseEntity.status(HttpStatus.CREATED).headers(httpHeaders).body(sseService.connect());
    }

    @Operation(
            summary = "기기 조작 요청",
            description = "방송 중 기기 조작을 요청합니다. 5분으로 설정"
    )
    @PostMapping("/request")
    public ResponseEntity<Map<String, String>> controlRequest(@RequestHeader(ACCESS_TOKEN) String token) {
        Map<String, String> result = broadcastService.control(token, (System.currentTimeMillis() + CONTROL_TIME_MS) / 1000L);

        sseService.sendMessage(result.get("userId"), (System.currentTimeMillis() + CONTROL_TIME_MS) / 1000L);

        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "방송 중인 보호소 가져오기",
            description = "방송 중인 보호소 정보를 가져옵니다."
    )
    @GetMapping("/broadcast/shelter")
    public ResponseEntity<BroadcastShelterResDto> getBroadcastShelter() {
        return ResponseEntity.ok(broadcastService.getBroadcastShelter());
    }

    @Operation(
            summary = "방송 시작하기",
            description = "보호소가 방송을 시작합니다."
    )
    @PostMapping("/broadcast")
    public ResponseEntity<MessageDto> startBroadcast(@RequestBody BroadcastReqDto broadcastReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        broadcastService.startBroadcast(broadcastReqDto, token);
        return ResponseEntity.ok(MessageDto.builder().msg("Start Broadcast").build());
    }
}
