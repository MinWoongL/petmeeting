package com.petmeeting.springboot.dto.adoption;

import com.petmeeting.springboot.domain.Adoption;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdoptionResDto {

    Integer adoptionNo;
    Integer memberNo;
    Integer dogNo;
    String dogName;
    Integer shelterNo; // 여기는 객체쓰면안댐
    String name;
    String gender;
    Integer age;
    String phoneNumber;
    String callTime;
    String residence;
    String job;
    Boolean petExperience;
    String additional;
    String adoptionStatus;

    public static AdoptionResDto entityToDto(Adoption adoption) {
        return AdoptionResDto.builder()
                .adoptionNo(adoption.getAdoptionNo())
                .memberNo(adoption.getMember().getId())
                .dogNo(adoption.getDog().getDogNo())
                .dogName(adoption.getDog().getName())
                .shelterNo(adoption.getShelter().getId())
                .name(adoption.getName())
                .gender(adoption.getGender().getValue())
                .age(adoption.getAge())
                .phoneNumber(adoption.getPhoneNumber())
                .callTime(adoption.getCallTime())
                .residence(adoption.getResidence())
                .job(adoption.getJob())
                .petExperience(adoption.getPetExperience())
                .additional(adoption.getAdditional())
                .adoptionStatus(adoption.getAdoptionStatus().getValue())
                .build();
    }
}
