package com.petmeeting.springboot.enums;

import lombok.Getter;

@Getter

public enum AdoptionAvailability {

    ADOPT_POSSIBLE("입양가능"),
    ADOPT_SUCCESS("입양완료"),
    ADOPT_IMPOSSIBLE("보호종료");


    private String value;

    AdoptionAvailability(String value){
        this.value = value;
    }
    
}
