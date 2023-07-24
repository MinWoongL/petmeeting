package com.petmeeting.springboot.dto.charge;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class KakaoReadyResDto {
    private String tid;
    private String next_redirect_pc_url;
}
