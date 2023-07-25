package com.petmeeting.springboot.dto.user;

import lombok.Data;

@Data
public class AdminUpdateReqDto {
    private Integer userNo;
    private Boolean isActivated;
}
