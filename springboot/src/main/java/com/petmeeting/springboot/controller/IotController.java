package com.petmeeting.springboot.controller;

import com.petmeeting.springboot.dto.common.MessageDto;
import com.petmeeting.springboot.dto.iot.IotReqDto;
import com.petmeeting.springboot.service.IotService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/iot")
public class IotController {
    private final String ACCESS_TOKEN = "AccessToken";

    private final IotService iotService;

    @Operation(
            summary = "IoT 기기 조작",
            description = "IoT 기기를 조작합니다."
    )
    @PostMapping("/{shelterNo}")
    public ResponseEntity<MessageDto> controlIot(@RequestBody IotReqDto iotReqDto, @PathVariable Integer shelterNo, @RequestHeader(ACCESS_TOKEN) String token) {
        iotService.control(iotReqDto, shelterNo, token);
        return ResponseEntity.ok(MessageDto.msg("Control Success"));
    }
}
