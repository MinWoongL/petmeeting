package com.petmeeting.springboot.domain;

import com.petmeeting.springboot.dto.user.UserUpdateReqDto;
import com.petmeeting.springboot.enums.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@SuperBuilder
@DynamicInsert
@NoArgsConstructor
@DiscriminatorColumn(name = "SHELTER", length = 10)
public class Shelter extends Users {

    @Transient
    private Role userGroup = Role.ROLE_SHELTER;

    @Column(name = "location", length = 150)
    private String location;

    @Column(name = "site_url", length = 50)
    private String siteUrl;

    @Column(name = "on_broadcast_title", length = 60)
    private String onBroadCastTitle;

    @Column(name = "regist_image_path", nullable = false)
    private String registImagePath;

    @Column(name = "dog_no")
    private Integer dogNo;

    @OneToMany(mappedBy = "shelter", fetch = FetchType.LAZY)
    private List<Dog> dogList;

    @OneToMany(mappedBy = "shelter", fetch = FetchType.LAZY)
    private List<Iot> iotList;

    @OneToMany(mappedBy = "shelter", fetch = FetchType.LAZY)
    private List<Chat> chatList;

    @OneToMany(mappedBy = "shelter", fetch = FetchType.LAZY)
    private List<Donation> donationList;

    @OneToMany(mappedBy = "shelter", fetch = FetchType.LAZY)
    private List<Adoption> adoptionList;

    @Override
    public void updateInfo(UserUpdateReqDto updateReqDto) {
        super.updateInfo(updateReqDto);
        this.location = updateReqDto.getLocation() == null ? this.location : updateReqDto.getLocation();
        this.siteUrl = updateReqDto.getSiteUrl() == null ? this.siteUrl : updateReqDto.getSiteUrl();
    }

    public void updateBroadCast(String onBroadcastTitle, Integer dogNo) {
        this.onBroadCastTitle = onBroadcastTitle;
        this.dogNo = dogNo;
    }

}
