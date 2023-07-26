package com.petmeeting.springboot.domain;

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

    @Column(name = "control_user_name", length = 50)
    private String controlUserName;

    @Column(name = "control_end_time")
    private Long controlEndTime;

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

    /**
     * 기기 조작하는 인원 등록
     * @param controlUserName
     * @param controlEndTime
     */
    public void setControlUser(String controlUserName, Long controlEndTime) {
        this.controlUserName = controlUserName;
        this.controlEndTime = controlEndTime;
    }
}
