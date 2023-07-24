package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.service.ImageServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping ("/api/v1/image")
@RequiredArgsConstructor
public class ImageController {

    // application.yml에서 값을 가져옵니다.
    @Value("${comm.uploadPath}")
    private String uploadPath;

    private final ImageServiceImpl imageService;

//    @Operation(
//            summary = "이미지 가져오기",
//            description = "경로에 있는 이미지 파일을 불러옵니다."
//    )
//    @GetMapping("/{imagePath}")
//    public ResponseEntity<MultipartFile> getImage(@PathVariable String imagePath) {
//
//        return null;
//    }

    @Operation(
            summary = "이미지 가져오기",
            description = "경로에 있는 이미지 파일을 불러옵니다."
    )
    @GetMapping("/{imagePath}")
    public ResponseEntity<Resource> getImage(@PathVariable String imagePath) {
        Map<String, Object> returnMap = imageService.getImage(imagePath);

        return new ResponseEntity<>((Resource) returnMap.get("resource"), (HttpHeaders)returnMap.get("header"), HttpStatus.OK);
    }

    @Operation(
            summary = "이미지 업로드",
            description = "이미지 파일을 저장하고 이미지 경로를 반환합니다."
    )
    @PostMapping
    public ResponseEntity<String> uploadImage(MultipartFile image) throws IOException {

        String path = imageService.uploadFile(image);
        return ResponseEntity.status(HttpStatus.CREATED).body(path);
    }

}
