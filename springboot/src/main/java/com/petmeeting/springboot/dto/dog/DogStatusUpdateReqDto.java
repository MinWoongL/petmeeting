package com.petmeeting.springboot.dto.dog;

import com.petmeeting.springboot.enums.AdoptionAvailability;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DogStatusUpdateReqDto {
    // 입양가능 or 보호종료만 가능
    private String adoptionAvailability;

}
