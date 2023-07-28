package com.petmeeting.springboot.dto.board;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BoardSearchCondition {
    String option;
    Integer page;
    Integer max;
    String title;

    public long calculateOffset() {
        if (page == null || max == null) {
            return 0;
        }
        return page * max;
    }
}
