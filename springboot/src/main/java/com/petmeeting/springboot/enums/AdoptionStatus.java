package com.petmeeting.springboot.enums;

import lombok.Getter;

@Getter
public enum AdoptionStatus {

    WAITING("대기중"),
    ADOPT_SUCCESS("채택"),
    ADOPT_FAIL("미채택");

    private String value;

    AdoptionStatus(String value){
        this.value = value;
    }

}
