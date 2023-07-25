package com.petmeeting.springboot.dto.user;

import com.petmeeting.springboot.domain.Admin;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.domain.Users;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SignInResDto {
    private Integer userNo;
    private String name;
    private String userGroup;
    private Integer joinDate;
    private String imagePath;
    private String phoneNumber;
    private Integer holdingToken;
    private Integer holdingPoint;
    private Boolean adopted;
    private String location;
    private String siteUrl;

    public static SignInResDto usersToDto(Users user) {
        if (user instanceof Member) {
            Member member = (Member) user;

            return SignInResDto.builder()
                    .userNo(member.getId())
                    .name(member.getName())
                    .userGroup(member.getUserGroup().getValue())
                    .joinDate(member.getJoinDate())
                    .imagePath(member.getImagePath())
                    .phoneNumber(member.getPhoneNumber())
                    .holdingToken(member.getHoldingToken())
                    .holdingPoint(member.getHoldingPoint())
                    .adopted(member.getAdopted())
                    .build();
        } else if (user instanceof Shelter) {
            Shelter shelter = (Shelter) user;

            return SignInResDto.builder()
                    .userNo(shelter.getId())
                    .name(shelter.getName())
                    .userGroup(shelter.getUserGroup().getValue())
                    .joinDate(shelter.getJoinDate())
                    .imagePath(shelter.getImagePath())
                    .phoneNumber(shelter.getPhoneNumber())
                    .location(shelter.getLocation())
                    .siteUrl(shelter.getSiteUrl())
                    .build();
        } else {
            Admin admin = (Admin) user;

            return SignInResDto.builder()
                    .userNo(admin.getId())
                    .userGroup(admin.getUserGroup().getValue())
                    .build();
        }
    }
}
