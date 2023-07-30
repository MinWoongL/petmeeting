package com.petmeeting.springboot.dto.dog;

import com.petmeeting.springboot.enums.AdoptionAvailability;
import com.petmeeting.springboot.enums.DogSize;
import lombok.Builder;
import lombok.Data;

import javax.persistence.Transient;

@Data
@Builder
public class DogSearchCondition {
    String option; // random & like & all & rank
    String name; // 포함
    DogSize dogSize; // 일치
    Integer shelterNo; // 얘는 입양가능 아니여도 모두 보이게
    Integer page;
    Integer max;

    @Transient
    AdoptionAvailability adoptionAvailability; // 입양가능만

    public Integer getOffset() {
        if(page == null || max == null) {
            return null;
        }

        return max * (page - 1);
    }

}
