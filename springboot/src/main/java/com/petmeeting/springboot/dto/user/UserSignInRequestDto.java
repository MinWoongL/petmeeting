package com.petmeeting.springboot.dto.user;

import com.petmeeting.springboot.domain.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserSignInRequestDto {
    String userId;
    String password;

    public Member toEntity() {
        return Member.builder()
                .userId(userId)
                .password(password)
                .build();
    }
}