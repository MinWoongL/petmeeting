package com.petmeeting.springboot.dto.donate;

public interface DonateHistoryProjection {
    Integer getMemberId();
    Integer getShelterId();
    Long getDonateValue();
}
