package com.petmeeting.springboot.enums;

import lombok.Getter;

@Getter
public enum Role {
    ROLE_MEMBER("사용자"),
    ROLE_SHELTER("보호소"),
    ROLE_ADMIN("관리자");

    private String value;

    Role(String value){
        this.value = value;
    }

}
