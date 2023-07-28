package com.petmeeting.springboot.dto.common;

import lombok.Data;

@Data
public class MessageDto {

    String msg;

    MessageDto(String msg) {
        this.msg = msg;
    }

}
