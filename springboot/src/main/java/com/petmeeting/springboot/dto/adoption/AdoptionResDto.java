package com.petmeeting.springboot.dto.adoption;

import com.petmeeting.springboot.domain.Adoption;
import com.petmeeting.springboot.domain.Dog;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.enums.AdoptionStatus;
import com.petmeeting.springboot.enums.Gender;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdoptionResDto {

    Integer adoptionNo;
    Member member;
    Dog dog;
    Shelter shelter;
    String name;
    Gender gender;
    Integer age;
    String callTime;
    String residence;
    String job;
    Boolean petExperience;
    String additional;
    AdoptionStatus adoptionStatus;

    public static AdoptionResDto entityToDto(Adoption adoption) {
        return AdoptionResDto.builder()
                .adoptionNo(adoption.getAdoptionNo())
                .member(adoption.getMember())
                .dog(adoption.getDog())
                .shelter(adoption.getShelter())
                .name(adoption.getName())
                .gender(adoption.getGender())
                .age(adoption.getAge())
                .callTime(adoption.getCallTime())
                .residence(adoption.getResidence())
                .job(adoption.getJob())
                .petExperience(adoption.getPetExperience())
                .additional(adoption.getAdditional())
                .adoptionStatus(adoption.getAdoptionStatus())
                .build();
    }
}
