package com.petmeeting.springboot.enums;

import lombok.Getter;

@Getter
public enum Gender {

    FEMALE("F"),
    MALE("M");

    private String value;

    Gender(String value){
        this.value = value;
    }

}
