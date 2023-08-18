package com.petmeeting.springboot.dto.charge;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChargeHistoryResDto {
    Integer chargeNo;
    Integer chargeValue;
    Long chargeTime;
}
