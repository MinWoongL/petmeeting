package com.petmeeting.springboot.dto.user;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpdateReqDto {
    private Integer userNo;
    private Boolean isActivated;
}
