package com.petmeeting.springboot.dto.adoption;

import com.petmeeting.springboot.domain.Users;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdoptionSearchCondition {

    Users user;
    Integer dogNo;

    Integer page;
    Integer max;

    public Integer getOffset() {
        if(page == null || max == null) {
            return 0;
        }

        return max * page;
    }

}
