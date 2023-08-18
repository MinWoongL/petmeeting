package com.petmeeting.springboot.dto.broadcast;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BroadcastReqDto {
    String onBroadcastTitle;
    Integer dogNo;
}
