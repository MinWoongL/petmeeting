package com.petmeeting.springboot.dto.user;

import com.petmeeting.springboot.domain.Role;
import lombok.*;

import java.time.LocalDate;

@Data
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserResDto {
    private Integer userNo;
    private String userId;
    private String name;
    private LocalDate joinDate;
    private Boolean isDeleted;
    private Boolean isActivated;
    private Role userGroup;
    private Integer imageNo;
}
