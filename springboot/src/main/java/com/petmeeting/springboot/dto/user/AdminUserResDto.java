package com.petmeeting.springboot.dto.user;

import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.domain.Users;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminUserResDto {
    private Integer userNo;
    private String userId;
    private String name;
    private Long joinDate;
    private Boolean isDeleted;
    private Boolean isActivated;
    private String userGroup;
    private String registImagePath;

    public AdminUserResDto userToDto(Users user) {
        if (user instanceof Member) {
            return memberToDto((Member) user);
        } else {
            return shelterToDto((Shelter) user);
        }
    }

    private AdminUserResDto shelterToDto(Shelter shelter) {
        return AdminUserResDto.builder()
                .userNo(shelter.getId())
                .userId(shelter.getUserId())
                .name(shelter.getName())
                .joinDate(shelter.getJoinDate())
                .isDeleted(shelter.getIsDeleted())
                .isActivated(shelter.getIsActivated())
                .userGroup(shelter.getUserGroup().getValue())
                .registImagePath(shelter.getRegistImagePath())
                .build();
    }

    private AdminUserResDto memberToDto(Member member) {
        return AdminUserResDto.builder()
                .userNo(member.getId())
                .userId(member.getUserId())
                .name(member.getName())
                .joinDate(member.getJoinDate())
                .isDeleted(member.getIsDeleted())
                .isActivated(member.getIsActivated())
                .userGroup(member.getUserGroup().getValue())
                .build();
    }
}
