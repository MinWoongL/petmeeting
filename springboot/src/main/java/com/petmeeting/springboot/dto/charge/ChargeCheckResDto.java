package com.petmeeting.springboot.dto.charge;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Builder
public class ChargeCheckResDto {
    private Integer price;
    private Integer addPoint;
    private Integer addToken;
    private Integer holdingPoint;
    private Integer holdingToken;
}
