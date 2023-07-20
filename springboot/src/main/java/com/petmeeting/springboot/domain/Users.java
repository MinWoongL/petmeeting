package com.petmeeting.springboot.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
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

    @Column(name = "user_id", unique = true, nullable = false)
    private String userId;

    @Column(name = "password", nullable = false)
    private String password;


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
