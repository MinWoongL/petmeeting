package com.petmeeting.springboot.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Charge {

    @Id @GeneratedValue
    @Column(name = "charge_no")
    private Integer chargeNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_no") // NOT NULL 넣어야되는데
    private Member member;

    @Column(name = "tid", length = 100, nullable = false)
    private String tid;

    @Column(name = "charge_value", nullable = false)
    private Integer chargeValue;

    @Column(name = "charge_time", nullable = false)
    private LocalDate chargeTime;

}
