package com.petmeeting.springboot.service;

import com.petmeeting.springboot.dto.iot.IotReqDto;

public interface IotService {
    void control(IotReqDto iotReqDto, Integer shelterNo, String token);
}
