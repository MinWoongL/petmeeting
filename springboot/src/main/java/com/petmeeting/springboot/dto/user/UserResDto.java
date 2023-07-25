package com.petmeeting.springboot.dto.user;

import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.domain.Users;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResDto {
    private Integer userNo;
    private String name;
    private String userGroup;
    private Long joinDate;
    private String imagePath;
    private String phoneNumber;
    private String location;
    private String siteUrl;

    /**
     * 작업 필요
     * @param user
     * @return
     */
    public UserResDto usersToDto(Users user) {
        if (user instanceof Member) {
            return memberToDto((Member) user);
        } else {
            return shelterToDto((Shelter) user);
        }
    }
    public UserResDto memberToDto(Member member) {
        return null;
    }

    public UserResDto shelterToDto(Shelter shelter) {
        return null;
    }
}
