package com.petmeeting.springboot.enums;

import lombok.Getter;

@Getter
public enum DogSize {

    SMALL_SIZE("소형견"),
    MEDIUM_SIZE("중형견"),
    BIG_SIZE("대형견");

    private String value;

    DogSize(String value) {
        this.value = value;
    }

}
