package com.petmeeting.springboot.dto.user;

import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.domain.Users;
import lombok.*;
import org.springframework.security.core.parameters.P;

import java.time.LocalDate;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResDto {
    private Integer userNo;
    private String name;
    private String userGroup;
    private LocalDate joinDate;
    private Integer imageNo;
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
