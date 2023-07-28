package com.petmeeting.springboot.dto.common;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MessageDto {
    String msg;
}
