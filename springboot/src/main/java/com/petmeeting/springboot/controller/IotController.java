package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.service.IotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/iot")
public class IotController {
    private final String ACCESS_TOKEN = "AccessToken";

    private final IotService iotService;

//    @PostMapping("/{shelterNo}")
//    public ResponseEntity<MessageDto> controlIot(@RequestBody IotReqDto iotReqDto, @RequestHeader(ACCESS_TOKEN) String token) {
//        iotService.control(iotReqDto, token);
//        return ResponseEntity.ok(MessageDto.msg("Control Success"));
//    }
}
