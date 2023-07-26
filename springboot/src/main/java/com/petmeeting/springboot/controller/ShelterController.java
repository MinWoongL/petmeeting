package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.shelter.ShelterResDto;
import com.petmeeting.springboot.dto.shelter.ShelterSearchCondition;
import com.petmeeting.springboot.service.ShelterService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shelter")
@RequiredArgsConstructor
public class ShelterController {

    private final ShelterService shelterService;

    @Operation(
            summary = "보호소 고유번호로 검색",
            description = "보호소 고유번호로 보호소 정보를 가져옵니다."
    )
    @GetMapping("/{shelterNo}")
    public ResponseEntity<ShelterResDto> getShelter(@PathVariable Integer shelterNo) {
        return ResponseEntity.ok(shelterService.getShelter(shelterNo));
    }

    @GetMapping
    public ResponseEntity<List<ShelterResDto>> getShelterByCondition(ShelterSearchCondition condition) {
        if (condition.getOption() != null && condition.getOption().toLowerCase().equals("all"))
            return ResponseEntity.ok(shelterService.getAllShelter());

        return ResponseEntity.ok(shelterService.getShelterByCondition(condition));
    }
}
