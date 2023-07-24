package com.petmeeting.springboot.dto.charge;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ChargeReadyResDto {
    private String tid;
    private String nextRedirectPcUrl;
}
