package com.petmeeting.springboot.dto.charge;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChargeReadyReqDto {
    private String selectPoint;
    private String selectToken;
    private String approvalUrl;
    private String cancelUrl;
    private String failUrl;
}
