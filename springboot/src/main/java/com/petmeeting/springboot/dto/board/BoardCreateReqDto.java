package com.petmeeting.springboot.dto.board;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BoardCreateReqDto {
    String title;
    String content;
    String imagePath;
}
