package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.broadcast.BroadcastCheckResDto;
import com.petmeeting.springboot.dto.broadcast.BroadcastReqDto;
import com.petmeeting.springboot.dto.broadcast.BroadcastShelterResDto;
import com.petmeeting.springboot.dto.broadcast.SseEmitters;
import com.petmeeting.springboot.dto.common.MessageDto;
import com.petmeeting.springboot.service.BroadcastService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/broadcast")
public class BroadcastController {

    private final BroadcastService broadcastService;
    private final String ACCESS_TOKEN = "AccessToken";
    private final Long CONTROL_TIME = 300L; // 5분 설정

    @Operation(
            summary = "기기 조작 요청",
            description = "방송 중 기기 조작을 요청합니다. 5분으로 설정"
    )
    @Transactional
    @PostMapping("/request/{shelterNo}")
    public ResponseEntity<Map<String, String>> controlRequest(@PathVariable Integer shelterNo, @RequestHeader(ACCESS_TOKEN) String token) {
        Map<String, String> result = broadcastService.control(shelterNo, token, CONTROL_TIME);
        sseEmitters.sendMessage(result.get("userId"), CONTROL_TIME);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "기기 조작 중지",
            description = "기기 조작을 중지합니다. 5분으로 설정"
    )
    @DeleteMapping("/request/{shelterNo}")
    public ResponseEntity<Map<String, String>> breakControl(@PathVariable Integer shelterNo, @RequestHeader(ACCESS_TOKEN) String token) {
        Map<String, String> result = broadcastService.breakControl(shelterNo, token);

        sseEmitters.sendMessage(result.get("userId"), 0L);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "방송 중인 보호소 가져오기",
            description = "방송 중인 보호소 정보를 가져옵니다."
    )
    @GetMapping("/shelter")
    public ResponseEntity<List<BroadcastShelterResDto>> getBroadcastShelter() {
        return ResponseEntity.ok(broadcastService.getBroadcastShelter());
    }

    @Operation(
            summary = "방송 시작하기",
            description = "보호소가 방송을 시작합니다."
    )
    @PostMapping
    @PreAuthorize("hasRole('ROLE_SHELTER')")
    public ResponseEntity<MessageDto> startBroadcast(@RequestBody BroadcastReqDto broadcastReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        broadcastService.startBroadcast(broadcastReqDto, token);
        return ResponseEntity.ok(MessageDto.msg("Start Broadcast"));
    }

    @Operation(
            summary = "방송 종료하기",
            description = "보호소가 방송을 종료합니다."
    )
    @DeleteMapping
    @PreAuthorize("hasRole('ROLE_SHELTER')")
    public ResponseEntity<MessageDto> stopBroadcast(@RequestHeader(ACCESS_TOKEN) String token) {
        broadcastService.stopBroadcast(token);
        sseEmitters.remove();
        return ResponseEntity.ok(MessageDto.msg("Stop Broadcast"));
    }

    @Operation(
            summary = "조작 중인 유저 체크",
            description = "IOT 기기를 조작 중인 회원이 있는지 체크합니다. 조작 중인 유저가 없을 시 유저 이름과 남은 시간에 null을 반환합니다."
    )
    @GetMapping("/check/{shelterNo}")
    public ResponseEntity<BroadcastCheckResDto> checkControlUser(@PathVariable Integer shelterNo) {
        return ResponseEntity.ok(broadcastService.checkControlUser(shelterNo));
    }


    // ---------------------------------- SSE 다시 확인 예정 -------------------------------
    private final SseEmitters sseEmitters;

    @Operation(
        summary = "SSE 통신 연결",
        description = "SSE 통신 연결하는 method입니다."
    )
    @GetMapping(value = "/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> connect() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        sseEmitters.add(emitter);
        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("connected!"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("X-Accel-Buffering", "no");
        return ResponseEntity.status(HttpStatus.OK).headers(httpHeaders).body(emitter);
    }
}
