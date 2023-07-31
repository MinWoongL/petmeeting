package com.petmeeting.springboot.dto.adoption;

import com.petmeeting.springboot.enums.AdoptionStatus;
import com.petmeeting.springboot.enums.Gender;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdoptionCreateResDto {

    Integer adoptionNo;
    Integer userNo;
    Integer dogNo;
    Integer shelterNo;
    String name;
    Gender gender;
    Integer age;
    String callTime;
    String residence;
    String job;
    Boolean petExperience;
    String additional;
    AdoptionStatus adoptionStatus;



}
