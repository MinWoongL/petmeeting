package com.petmeeting.springboot.dto.charge;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class KakaoApproveResDto {
    private String tid;
    private Amount amount;
    private String item_name;
}
