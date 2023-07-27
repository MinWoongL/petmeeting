package com.petmeeting.springboot.dto.shelter;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShelterResDto {
    Integer shelterNo;
    String name;
    String phoneNumber;
    Long joinDate;
    String imagePath;
    String location;
    String siteUrl;
}
