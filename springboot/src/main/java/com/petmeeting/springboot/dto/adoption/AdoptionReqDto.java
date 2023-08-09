package com.petmeeting.springboot.dto.adoption;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdoptionReqDto {

    Integer dogNo;
    String name; // 사람이름
    String gender;
    Integer age;
    String callTime;
    String phoneNumber;
    String residence;
    String job;
    Boolean petExperience;
    String additional;


}
