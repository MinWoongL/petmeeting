package com.petmeeting.springboot.service;

import com.petmeeting.springboot.dto.adoption.*;

import java.util.List;

public interface AdoptionService {
    AdoptionResDto createAdoption(AdoptionReqDto adoptionCreateReqDto, String token);
    AdoptionResDto getAdoption(Integer adoptionNo, String token);
    AdoptionResDto updateAdoption(Integer adoptionNo, AdoptionUpdateReqDto adoptionUpdateReqDto, String token);
    void deleteAdoption(Integer adoptionNo, String token);
    AdoptionResDto updateAdoptionStatus(Integer adoptionNo, AdoptStatusUpdateReqDto adoptStatusUpdateDto, String token);
    List<AdoptionResDto> findAdoptionByCondition(AdoptionSearchCondition condition, String token);

}
