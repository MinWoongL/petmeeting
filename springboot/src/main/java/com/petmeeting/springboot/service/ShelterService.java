package com.petmeeting.springboot.service;

import com.petmeeting.springboot.dto.shelter.ChatReqDto;
import com.petmeeting.springboot.dto.shelter.ChatResDto;
import com.petmeeting.springboot.dto.shelter.ShelterResDto;
import com.petmeeting.springboot.dto.shelter.ShelterSearchCondition;

import java.util.List;

public interface ShelterService {
    void registChat(ChatReqDto chatReqDto, String token);
    List<ChatResDto> getChatList(Integer shelterNo);
    List<ShelterResDto> getShelterByCondition(ShelterSearchCondition condition);
    List<ShelterResDto> getAllShelter();
    ShelterResDto getShelter(Integer shelterNo);
}
