package com.petmeeting.springboot.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping ("/api/v1/image")
@RequiredArgsConstructor
public class ImageController {

    @GetMapping("/{imageNo}")
    public ResponseEntity<MultipartFile> getImage(@PathVariable Integer imageNo) {

        return null;
    }
}
