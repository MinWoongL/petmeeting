package com.petmeeting.springboot.service;

import com.petmeeting.springboot.dto.broadcast.BroadcastCheckResDto;
import com.petmeeting.springboot.dto.broadcast.BroadcastReqDto;
import com.petmeeting.springboot.dto.broadcast.BroadcastShelterResDto;

import java.util.List;
import java.util.Map;

public interface BroadcastService {
    Map<String, String> control(Integer shelterNo, String token, long remainTime);
    List<BroadcastShelterResDto> getBroadcastShelter();
    void startBroadcast(BroadcastReqDto broadcastReqDto, String token);
    void stopBroadcast(String token);
    BroadcastCheckResDto checkControlUser(Integer shelterNo);
    Map<String, String> breakControl(Integer shelterNo, String token);
}
