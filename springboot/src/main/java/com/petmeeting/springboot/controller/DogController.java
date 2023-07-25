package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.domain.Dog;
import com.petmeeting.springboot.service.DogService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> addDog(Dog dog){

        return null;
    }

    @Operation(
            summary = "강아지 정보 가져오기",
            description = "유기견 정보를 가져옵니다."
    )
    @GetMapping("/{dogNo}")
    public ResponseEntity<Dog> getOneDog(@PathVariable Integer dogNo){

        return null;
    }

}
