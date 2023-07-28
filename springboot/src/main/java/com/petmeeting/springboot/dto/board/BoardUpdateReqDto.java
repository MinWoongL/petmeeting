package com.petmeeting.springboot.dto.board;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BoardUpdateReqDto {
    private String title;
    private String content;
    private String imagePath;
}
