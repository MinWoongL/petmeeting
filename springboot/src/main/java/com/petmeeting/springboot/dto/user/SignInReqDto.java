package com.petmeeting.springboot.dto.user;

import com.petmeeting.springboot.domain.Member;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SignInReqDto {
    String userId;
    String password;

    public Member toEntity() {
        return Member.builder()
                .userId(userId)
                .password(password)
                .build();
    }
}