package com.petmeeting.springboot.dto.user;

import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.enums.Role;
import lombok.Data;

@Data
public class SignUpReqDto {
    private String userId;
    private String password;
    private String name;
    private String phoneNumber;
    private String userGroup;
    private String imagePath;
    private String location;
    private String siteUrl;
    private String registImagePath;

    public Users toEntity() {
        if (userGroup.equals(Role.ROLE_MEMBER.getValue())) {
            return Member.builder()
                    .userId(userId)
                    .password(password)
                    .name(name)
                    .phoneNumber(phoneNumber)
                    .userGroup(Role.ROLE_MEMBER)
                    .imagePath(imagePath)
                    .joinDate((int) System.currentTimeMillis() / 1000)
                    .build();

        } else {
            return Shelter.builder()
                    .userId(userId)
                    .password(password)
                    .name(name)
                    .phoneNumber(phoneNumber)
                    .userGroup(Role.ROLE_SHELTER)
                    .imagePath(imagePath)
                    .joinDate((int) System.currentTimeMillis() / 1000)
                    .location(location)
                    .siteUrl(siteUrl)
                    .isActivated(false)
                    .registImagePath(registImagePath)
                    .build();
        }
    }
}