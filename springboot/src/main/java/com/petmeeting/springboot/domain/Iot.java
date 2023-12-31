package com.petmeeting.springboot.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Iot {

    @Id @GeneratedValue
    @Column(name = "iot_no")
    private Integer iotNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelter_no")
    private Shelter shelter;

    @Column(name = "iot_group")
    private String iotGroup; // 기기종류

    @Column(name = "command")
    private String command; // 실행중인 명령
}
