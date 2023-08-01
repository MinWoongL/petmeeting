package com.petmeeting.springboot.dto.adoption;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdoptionUpdateReqDto {

    String name;
    String gender;
    Integer age;
    String callTime;
    String residence;
    String job;
    Boolean petExperience;
    String additional;


}
