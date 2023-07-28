package com.petmeeting.springboot.dto.common;

import lombok.Data;

@Data
public class ResultDto {

    Boolean result;

    ResultDto (Boolean result) {
        this.result = result;
    }
}
