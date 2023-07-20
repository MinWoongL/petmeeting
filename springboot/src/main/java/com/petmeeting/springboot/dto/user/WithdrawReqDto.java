package com.petmeeting.springboot.dto.user;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class WithdrawReqDto {
    private Integer userNo;
    private String password;
}
