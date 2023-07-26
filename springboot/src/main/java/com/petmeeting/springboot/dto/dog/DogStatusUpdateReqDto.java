package com.petmeeting.springboot.dto.dog;

import lombok.Data;

@Data
public class DogStatusUpdateReqDto {

    private Integer dogNo;
    private String adoptionAvailability;

}
