package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.shelter.ChatReqDto;
import com.petmeeting.springboot.dto.shelter.ChatResDto;
import com.petmeeting.springboot.dto.shelter.ShelterResDto;
import com.petmeeting.springboot.dto.shelter.ShelterSearchCondition;
import com.petmeeting.springboot.service.ShelterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shelter")
@RequiredArgsConstructor
public class ShelterController {

    private final ShelterService shelterService;
    private final String ACCESS_TOKEN = "AccessToken";

    @Operation(
            summary = "보호소 고유번호로 검색",
            description = "보호소 고유번호로 보호소 정보를 가져옵니다."
    )
    @GetMapping("/{shelterNo}")
    public ResponseEntity<ShelterResDto> getShelter(@PathVariable Integer shelterNo) {
        return ResponseEntity.ok(shelterService.getShelter(shelterNo));
    }

    @Operation(
            summary = "보호소 검색조건으로 검색",
            description = "검색조건에 따라 보호소를 반환합니다."
    )
    @GetMapping
    public ResponseEntity<List<ShelterResDto>> getShelterByCondition
            (@Parameter(description = "option : 'all' : page나 max에 관계없이 모든 목록, null일 경우 적용 안 됨 / page : 반환받을 페이지(default = 1) / max : 반환받을 크기(default = 10) / name : 보호소이름 / location : 보호소 주소")
             ShelterSearchCondition condition) {
        if (condition.getOption() != null && condition.getOption().toLowerCase().equals("all"))
            return ResponseEntity.ok(shelterService.getAllShelter());

        return ResponseEntity.ok(shelterService.getShelterByCondition(condition));
    }

    @Operation(
            summary = "보호소 채팅목록 가져오기",
            description = "해당 보호소의 채팅 목록을 가져옵니다."
    )
    @GetMapping("/{shelterNo}/chat")
    public ResponseEntity<List<ChatResDto>> getChatList(@PathVariable Integer shelterNo) {
        return ResponseEntity.ok(shelterService.getChatList(shelterNo));
    }

    @Operation(
            summary = "보호소 채팅 등록하기",
            description = "해당 보호소에 채팅을 등록합니다. 등록 후 보호소에 등록된 모든 채팅을 반환합니다."
    )
    @PostMapping("/chat")
    public ResponseEntity<List<ChatResDto>> registChat(@RequestBody ChatReqDto chatReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        shelterService.registChat(chatReqDto, token);
        return ResponseEntity.ok(shelterService.getChatList(chatReqDto.getShelterNo()));
    }
}
