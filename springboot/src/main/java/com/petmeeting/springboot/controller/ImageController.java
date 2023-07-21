package com.petmeeting.springboot.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping ("/api/v1/image")
@RequiredArgsConstructor
public class ImageController {

    @Operation(
            summary = "이미지 가져오기 / 작업 필요",
            description = "이미지번호로 이미지를 찾아 반환합니다."
    )
    @GetMapping("/{imageNo}")
    public ResponseEntity<MultipartFile> getImage(@PathVariable Integer imageNo) {

        return null;
    }

    @Operation(
            summary = "이미지 등록하기 / 작업 필요",
            description = "이미지 저장 후 이미지 고유번호를 반환합니다."
    )
    @PostMapping
    public ResponseEntity<Integer> registImage(@RequestPart MultipartFile imageFile) {

        return null;
    }
}
