package com.petmeeting.springboot.dto.inquiry;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InquirySearchCondition {
    String option;
    Integer page;
    Integer max;
    String title;

    public Integer getOffset() {
        if(page == null || max == null) {
            return 0;
        }
        return max * page;
    }
}
