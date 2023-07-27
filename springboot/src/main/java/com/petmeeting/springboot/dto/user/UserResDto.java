package com.petmeeting.springboot.dto.user;

import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.domain.Users;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResDto {
    private String name;
    private String userGroup;
    private Long joinDate;
    private String imagePath;
    private String phoneNumber;
    private String location;
    private String siteUrl;

    /**
     * 유저가 Member, Shelter임에 따라 값을 넣어 반환합니다.
     * @param Users
     * @return UserResDto
     */
    public UserResDto usersToDto(Users user) {
        if (user instanceof Member) {
            return memberToDto((Member) user);
        } else {
            return shelterToDto((Shelter) user);
        }
    }
    public UserResDto memberToDto(Member member) {
        return UserResDto.builder()
                .name(member.getName())
                .userGroup(member.getUserGroup().getValue())
                .joinDate(member.getJoinDate())
                .imagePath(member.getImagePath())
                .phoneNumber(member.getPhoneNumber())
                .build();
    }

    public UserResDto shelterToDto(Shelter shelter) {
        return UserResDto.builder()
                .name(shelter.getName())
                .userGroup(shelter.getUserGroup().getValue())
                .joinDate(shelter.getJoinDate())
                .imagePath(shelter.getImagePath())
                .phoneNumber(shelter.getPhoneNumber())
                .location(shelter.getLocation())
                .siteUrl(shelter.getSiteUrl())
                .build();
    }
}
