package com.petmeeting.springboot.service;

import com.petmeeting.springboot.dto.charge.*;

import java.util.List;

public interface ChargeService {
    List<ChargeHistoryResDto> getHistory(String token);
    ChargeCheckResDto check(ChargeCheckReqDto chargeCheckReqDto, String token);
    ChargeReadyResDto ready(ChargeReadyReqDto chargeReadyReqDto, String token);
}
