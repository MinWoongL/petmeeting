package com.petmeeting.springboot.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@SuperBuilder
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "user_group")
public abstract class Users {
    @Id @GeneratedValue
    @Column(name = "user_no")
    private Integer id;

    @Column(name = "user_id", unique = true, nullable = false, length = 50)
    private String userId;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    // LocalDate <-> timestamp 확인
    @Column(name = "join_date", nullable = false)
    private LocalDate joinDate;

    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    @Column(name = "is_deleted", nullable = false)
    @ColumnDefault("false")
    private Boolean isDeleted;

    @Column(name = "is_activated", nullable = false)
//    @ColumnDefault("true") 보호소, 사용자 DEFAULT 값 다름 확인
    private Boolean isActivated;

    // ROLE 중에 1개
    @Column(name = "user_group", length = 10, nullable = false)
    private Role userGroup;
//    private String userGroup;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "image_no")
    private Image image;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<LikeBoard> likeBoardList;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<LikeReply> likeReplyList;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Inquiry> inquiryList;



    public void setPassword(String password) {
        this.password = password;
    }




}
