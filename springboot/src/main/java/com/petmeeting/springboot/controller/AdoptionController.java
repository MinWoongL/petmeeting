package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.adoption.AdoptionCreateReqDto;
import com.petmeeting.springboot.dto.adoption.AdoptionResDto;
import com.petmeeting.springboot.dto.adoption.AdoptionSearchCondition;
import com.petmeeting.springboot.dto.common.MessageDto;
import com.petmeeting.springboot.service.AdoptionService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/adoption")
public class AdoptionController {

    private final AdoptionService adoptionService;
    private final String ACCESS_TOKEN = "AccessToken";

    @Operation(
            summary = "입양신청서를 등록합니다.",
            description = "등록 성공시 등록된 신청서를 반환합니다."
    )
    @PostMapping
    public ResponseEntity<AdoptionResDto> registerAdoption(@RequestBody AdoptionCreateReqDto adoptionCreateReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adoptionService.createAdoption(adoptionCreateReqDto, token));
    }

    @Operation(
            summary = "입양신청 결과를 수정합니다.",
            description = "입양신청 수정 결과를 반환합니다. " +
                    "adoptionStatus가 '대기중'이 아니면 요청을 거부합니다."
    )
    @PutMapping("/{adoptionNo}")
    public ResponseEntity<?> updateAdoption() {
        return null;
    }

    @Operation(
            summary = "입양신청을 삭제합니다.",
            description = "삭제시 'Delete Success'를 반환합니다." +
                    "adoptionStatus가 '채택'이면 요청을 거부합니다."
    )
    @DeleteMapping("/{adoptionNo}")
    public ResponseEntity<MessageDto> deleteAdoption() {

        return ResponseEntity.ok(MessageDto.builder().msg("").build());
    }

    @Operation(
            summary = "입양신청서의 상태를 변경합니다.",
            description = "유기견의 상태가 '입양완료'로 변경됩니다." +
                    "작성자의 입양여부가 true로 변경됩니다." +
                    "해당 유기견의 모든 adoptionStatus가 '미채택'으로 변경됩니다."
    )
    @PutMapping("/status/{adoptionNo}")
    public ResponseEntity<?> updateAdoptionStatus() {
        return null;
    }

    @Operation(
            summary = "입양신청서 세부 조회",
            description = "입양신청서 번호로 입양신청서 세부내용을 조회합니다."
    )
    @GetMapping("/{adoptionNo}")
    public ResponseEntity<?> getAdoption() {
        return null;
    }

    @Operation(
            summary = "입양신청서 목록 조회",
            description = "일반회원이 요청할 경우, 해당 회원이 작성한 입양신청서 목록이 나오고," +
                    "보호소 회원이 요청할 경우, 해당 보호소에 작성된 입양신청서 목록이 반환됩니다." +
                    "dogNo가 있을 경우 해당 강아지에게 해당되는 정보만 제공됩니다."
    )
    @GetMapping
    public ResponseEntity<?> getAllAdoptions(AdoptionSearchCondition condition) {
        return null;
    }

}
