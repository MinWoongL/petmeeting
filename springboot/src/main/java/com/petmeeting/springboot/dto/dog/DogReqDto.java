package com.petmeeting.springboot.dto.dog;

// 유기견 등록할 때 필요한 Dto

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DogReqDto {
    String name;
    String dogSize;
    String gender;
    Integer weight;
    Integer age;
    String personality;
    Long protectionStartDate;
    Long protectionEndDate;
    String adoptionAvailability;
    String currentStatus;
    String dogSpecies;
    String reasonAbandonment;
    Boolean isInoculated;
    String imagePath;
}
