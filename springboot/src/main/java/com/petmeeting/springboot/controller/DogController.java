package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.dog.*;
import com.petmeeting.springboot.enums.AdoptionAvailability;
import com.petmeeting.springboot.service.DogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/dog")
public class DogController {

    private final DogService dogService;
    private final String ACCESS_TOKEN = "AccessToken";

    @Operation(
            summary = "유기견 등록(CREATE)",
            description = "새로운 유기견을 등록합니다."
    )
    @PostMapping
    public ResponseEntity<RegisterDogResDto> registerDog(@RequestBody RegisterDogReqDto requestDto, @RequestHeader(ACCESS_TOKEN) String token) {
        Map<String, Object> result = dogService.registerDog(requestDto, token);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body((RegisterDogResDto) result.get("dog"));
    }

    @Operation(
            summary = "유기견 보호상태 변경(보호소)",
            description = "해당 유기견의 보호 상태를 변경합니다. " +
                    "만약 '보호종료'가 되면 해당 유기견의 입양신청서가 모두 '미채택'으로 변경됩니다."
    )
    @PutMapping("/status/{dogNo}") // 이거 파라미터 어케해야대징
//    @PreAuthorize("hasRole('ROLE_SHELTER')")
    public ResponseEntity<DogResDto> updateDogStatus(@PathVariable Integer dogNo, @RequestBody DogStatusUpdateReqDto dogStatusUpdateReqDto, @RequestHeader(ACCESS_TOKEN) String token){
        Map<String, Object> result = dogService.updateDogStatus(dogNo, dogStatusUpdateReqDto, token);
        return ResponseEntity.status(HttpStatus.OK)
                .body((DogResDto) result.get("dog"));
    }

    @Operation(
            summary = "유기견 상세보기",
            description = "특정 유기견을 상세보기합니다. 로그인 해야만 권한이 있습니다."
    )
    @GetMapping("/{dogNo}")
    public ResponseEntity<DogResDto> findDog(@PathVariable Integer dogNo, @RequestHeader(ACCESS_TOKEN) String token) {
        Map<String, Object> result = dogService.findDog(dogNo, token);

        return ResponseEntity.status(HttpStatus.OK)
                .body((DogResDto) result.get("dog"));
    }

    @Operation(
            summary = "조건에 따라 유기견 목록 조회하기",
            description = " 검색 조건에 따라 유기견의 목록을 반환합니다."
    )
    @GetMapping
    public ResponseEntity<List<RegisterDogResDto>> findAllDogByOption
            (@Parameter(description = "option : 'all'")
             DogSearchCondition condition, @RequestHeader(ACCESS_TOKEN) String token) {
        if(condition.getOption() != null && condition.getOption().toLowerCase().equals("all")){
            return ResponseEntity.ok(dogService.getAllDog());
        }

        return null;
    }

    @Operation(
            summary = "유기견 정보를 수정합니다.",
            description = "shelter의 번호와 유기견의 보호소가 일치하는 경우에만 수정됩니다."
    )
    @PutMapping("/{dogNo}")
    public ResponseEntity<DogResDto> updateDog(@PathVariable Integer dogNo, @RequestBody RegisterDogReqDto registerDogReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.ok(dogService.updateDog(dogNo, registerDogReqDto, token));
    }

    @Operation(
            summary = "유기견 삭제",
            description = "해당 넘버의 유기견을 삭제합니다. 성공시 Delete Succuess 메세지를 반환합니다."
    )
    @DeleteMapping("/{dogNo}")
    public ResponseEntity<String> deleteDog(@PathVariable Integer dogNo, @RequestHeader(ACCESS_TOKEN) String token) {
        dogService.deleteDog(dogNo, token);

        return ResponseEntity.ok("Delete Success");
    }





















}
