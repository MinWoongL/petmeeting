package com.petmeeting.springboot.dto.charge;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ChargeCheckReqDto {
    private String tid;
    private String pgToken;
}
