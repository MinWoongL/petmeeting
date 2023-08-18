package com.petmeeting.springboot.dto.common;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResultDto {
    Boolean result;

    public static ResultDto result(Boolean result) {
        return ResultDto.builder().result(result).build();
    }
}
