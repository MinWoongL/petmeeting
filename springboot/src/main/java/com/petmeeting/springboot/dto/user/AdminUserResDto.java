package com.petmeeting.springboot.dto.user;

import com.petmeeting.springboot.enums.Role;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AdminUserResDto {
    private Integer userNo;
    private String userId;
    private String name;
    private LocalDate joinDate;
    private Boolean isDeleted;
    private Boolean isActivated;
    private  Role userGroup;
    private String imagePath;


}
