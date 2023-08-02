package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.service.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping ("/api/v1/image")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @Operation(
            summary = "이미지 가져오기",
            description = "이미지 네임을 통해 경로에 있는 이미지 파일을 불러옵니다."
    )
    @GetMapping("/{imageName}")
    public ResponseEntity<Resource> getImage(@PathVariable String imageName, @RequestParam("option") String option) {
        System.out.println("option = " + option);

        Map<String, Object> returnMap = imageService.getImage(imageName);
        return new ResponseEntity<>((Resource) returnMap.get("resource"), (HttpHeaders)returnMap.get("header"), HttpStatus.OK);
    }

    @Operation(
            summary = "이미지 업로드",
            description = "이미지 파일을 저장하고 이미지 네임을 반환합니다."
    )
    @PostMapping
    public ResponseEntity<String> uploadImage(MultipartFile image, @RequestParam("option") String option) throws IOException {
        System.out.println("option = " + option);

        String imageName = imageService.uploadImage(image);
        return ResponseEntity.status(HttpStatus.CREATED).body(imageName);
    }

}
