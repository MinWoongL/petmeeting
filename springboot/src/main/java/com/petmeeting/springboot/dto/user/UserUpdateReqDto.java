package com.petmeeting.springboot.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserUpdateReqDto {
    private String password;
    private String name;
    private String phoneNumber;
    private String imagePath;
    private String location;
    private String siteUrl;
}
