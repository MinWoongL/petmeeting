package com.petmeeting.springboot.dto.charge;

import lombok.Data;

@Data
public class KakaoApproveResDto {
    private String tid;
    private Amount amount;
    private String item_name;
}
