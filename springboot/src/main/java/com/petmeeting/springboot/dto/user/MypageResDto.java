package com.petmeeting.springboot.dto.user;

import com.petmeeting.springboot.domain.Member;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MypageResDto {
    // 마이페이지 정보 조회

    private String name;
    private String phoneNumber;
    // 가지고있는 코인
    private Integer holdingPoint;
    private Integer holdingToken;

    public static MypageResDto mypageToDto(Member member) {
        return MypageResDto.builder()
                .name(member.getName())
                .phoneNumber(member.getPhoneNumber())
                .holdingPoint(member.getHoldingPoint())
                .holdingToken(member.getHoldingToken())
                .build();
    }
}
