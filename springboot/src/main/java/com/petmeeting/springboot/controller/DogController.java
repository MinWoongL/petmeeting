package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.dog.DogResDto;
import com.petmeeting.springboot.dto.dog.DogStatusUpdateReqDto;
import com.petmeeting.springboot.dto.dog.RegisterDogReqDto;
import com.petmeeting.springboot.dto.dog.RegisterDogResDto;
import com.petmeeting.springboot.enums.AdoptionAvailability;
import com.petmeeting.springboot.service.DogService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<RegisterDogResDto> registerDog(RegisterDogReqDto requestDto, @RequestHeader(ACCESS_TOKEN) String token) {
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
    public ResponseEntity<DogResDto> updateDogStatus(@PathVariable Integer dogNo, AdoptionAvailability adoptionAvailability, @RequestHeader(ACCESS_TOKEN) String token){
        DogStatusUpdateReqDto dogStatusUpdateReqDto = new DogStatusUpdateReqDto(dogNo, adoptionAvailability);

        Map<String, Object> result = dogService.updateDogStatus(dogStatusUpdateReqDto, token);
        return ResponseEntity.status(HttpStatus.OK).body((DogResDto) result.get("dog"));
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
            description = " 검색 조건에 따라 유기견의 목록을 가져옵니다. 검색 조건이 없으면 필터링되지 않은 목록을 가져옵니다.\n" +
                    "\n" +
                    "* name은 포함, dogSize는 일치\n" +
                    "* 입양가능인 상태만 가져옵니다.\n" +
                    "\n" +
                    "** shelterNo로 요청 시에는 입양 상태 상관없이 해당 보호소의 모든 유기견 목록을 가져옵니다.\n" +
                    "\n" +
                    "** option으로 요청 시 \n" +
                    "random : 무작위\n" +
                    "like : 로그인한 유저가 like한 유기견\n" +
                    "all : 모든 유기견\n" +
                    "rank : 좋아요 상위 유기견"
    )
    @GetMapping
    public ResponseEntity<List<DogResDto>> findAllDogByOption(RegisterDogReqDto registerDogReqDto, @RequestHeader(ACCESS_TOKEN) String token) {

    }

    @Operation(
            summary = "유기견 정보를 수정합니다.",
            description = "shelter의 번호와 유기견의 보호소가 일치하는 경우에만 수정됩니다."
    )
    @PutMapping("/{dogNo}")
    public ResponseEntity<DogResDto> updateDog(@PathVariable Integer dogNo, RegisterDogReqDto registerDogReqDto, @RequestHeader(ACCESS_TOKEN) String token) {

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





















//    // READ
//    @Operation(
//            summary = "강아지 정보 가져오기",
//            description = "유기견 정보를 가져옵니다."
//    )
//    @GetMapping("/{dogNo}")
//    public ResponseEntity<Dog> getOneDog(@PathVariable Integer dogNo) {
//
//        return null;
//    }
//
//    // UPDATE
//    @Operation(
//            summary = "",
//            description = ""
//    )
//    @PutMapping("/{dogNo}")
//    public ResponseEntity<?> updateDog(@PathVariable Integer dogNo) {
//
//        return null;
//    }
//
//    // DELETE
//    @Operation(
//            summary = "",
//            description = ""
//    )
//    @DeleteMapping("/{dogNo}")
//    public ResponseEntity<?> deleteDog(@PathVariable Integer dogNo) {
//
//        return null;
//    }
//
//    // 유기견 상태 변경
//    @Operation(
//            summary = "(보호소) 유기견 상태 변경",
//            description = "유기견의 상태를 변경합니다." +
//                    "* userNo는 현재 로그인한 유저의 고유번호를 입력합니다." +
//                    "* 보호종료 상태로 변경될 시 해당 유기견에게 할당된 모든 입양신청서의 adoptionStatus가 “미채택”으로 변경됩니다."
//    )
//    @PutMapping("/status/{dogNo}")
//    public ResponseEntity<?> updateDogStatus(@PathVariable Integer dogNo, DogStatusUpdateReqDto dogStatusUpdateReqDto){
//
//
//        return null;
//    }
}
