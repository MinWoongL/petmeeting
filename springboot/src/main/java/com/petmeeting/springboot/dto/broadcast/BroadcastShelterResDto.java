package com.petmeeting.springboot.dto.broadcast;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BroadcastShelterResDto {
    private Integer shelterNo;
    private String name;
    private String onBroadcastTitle;
    private Integer dogNo;
}
