package com.petmeeting.springboot.dto.reply;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReplyUpdateReqDto {

    String content;
}
