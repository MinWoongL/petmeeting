package com.petmeeting.springboot.dto.dog;

// 유기견 등록할 때 필요한 Dto

import com.petmeeting.springboot.domain.Dog;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.enums.AdoptionAvailability;
import com.petmeeting.springboot.enums.DogSize;
import com.petmeeting.springboot.enums.Gender;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterDogReqDto {
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

    // Dto -> Entity 로직
//    public Dog toEntity(Shelter shelter){
//        return Dog.builder()
//                .shelter(shelter)
//                .name(name)
//                .dogSize((DogSize) dogSize)
//                .gender(gender)
//                .weight(weight)
//                .age(age)
//                .personality(personality)
//                .protectionStartDate(protectionStartDate)
//                .protectionEndDate(protectionEndDate)
//                .adoptionAvailability(adoptionAvailability)
//                .currentStatus(currentStatus)
//                .dogSpecies(dogSpecies)
//                .reasonAbandonment(reasonAbandonment)
//                .isInoculated(isInoculated)
//                .imagePath(imagePath)
//                .build();
//    }
}
