package com.petmeeting.springboot.dto.adoption;

import com.petmeeting.springboot.domain.Adoption;
import com.petmeeting.springboot.domain.Dog;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.enums.AdoptionStatus;
import com.petmeeting.springboot.enums.Gender;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdoptionCreateReqDto {

    Dog dog;
    String name; // 사람이름
    Gender gender;
    Integer age;
    String callTime;
    String residence;
    String job;
    Boolean petExperience;
    String additional;


}
