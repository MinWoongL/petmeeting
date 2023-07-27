package com.petmeeting.springboot.dto.shelter;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatReqDto {
    Integer shelterNo;
    String content;
}
