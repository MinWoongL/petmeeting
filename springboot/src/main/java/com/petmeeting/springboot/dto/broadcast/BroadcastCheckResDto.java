package com.petmeeting.springboot.dto.broadcast;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BroadcastCheckResDto {
    public String userName;
    public Long remainTime;
}
