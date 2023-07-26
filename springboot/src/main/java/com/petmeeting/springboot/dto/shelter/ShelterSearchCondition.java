package com.petmeeting.springboot.dto.shelter;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShelterSearchCondition {
    String option;
    Integer page;
    Integer max;
    String name;
    String location;

    public Integer getOffset() {
        if (page == null || max == null)
            return null;

        return max * (page - 1);
    }
}
