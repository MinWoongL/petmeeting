package com.petmeeting.springboot.dto.donate;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DonateHistoryResDto {
    Integer donationNo;
    String dogName;
    String shelterName;
    Integer donationValue;
    Long donationTime;

    String userId;
    String userName;
    Long donateValue;
}
