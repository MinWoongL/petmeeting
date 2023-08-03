package com.petmeeting.springboot.dto.iot;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IotReqDto {
    Integer command;
}
