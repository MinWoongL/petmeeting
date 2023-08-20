package com.petmeeting.springboot.service;

import com.petmeeting.springboot.dto.donate.DonateHistoryResDto;
import com.petmeeting.springboot.dto.donate.DonateReqDto;
import com.petmeeting.springboot.dto.donate.DonateResDto;

import java.util.List;

public interface DonateService {
    List<DonateHistoryResDto> donateHistory(Integer userNo);
    DonateResDto donateToDog(DonateReqDto donateReqDto, String token);
}
