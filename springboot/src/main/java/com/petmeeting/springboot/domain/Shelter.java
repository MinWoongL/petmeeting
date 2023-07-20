package com.petmeeting.springboot.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@SuperBuilder
@NoArgsConstructor
@DiscriminatorColumn(name = "ROLE_SHELTER", length = 10)
public class Shelter extends Users {
    @Transient
    private Role userGroup = Role.ROLE_SHELTER;

    @Column(name = "location", length = 150)
    private String location;

    @Column(name = "site_url", length = 50)
    private String siteUrl;

    @Column(name = "on_broadcast_title", length = 60)
    private String onBroadCastTitle;


    // List<Dog> dogs 해야함
    // 넹 하겠습니다 대장님
    @OneToOne(mappedBy = "shelter", fetch = FetchType.LAZY)
    private Regist regist;

    @OneToMany(mappedBy = "shelter", fetch = FetchType.LAZY)
    private List<Dog> dogList;

    @OneToMany(mappedBy = "shelter", fetch = FetchType.LAZY)
    private List<Iot> iotList;

    @OneToMany(mappedBy = "shelter", fetch = FetchType.LAZY)
    private List<Chat> chatList;

    @OneToMany(mappedBy = "shelter", fetch = FetchType.LAZY)
    private List<Donation> donationList;
}
