package com.petmeeting.springboot.dto.shelter;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatResDto {
    private Integer chatNo;
    private Integer userNo;
    private String userName;
    private String content;
    private Long createdTime;
}
