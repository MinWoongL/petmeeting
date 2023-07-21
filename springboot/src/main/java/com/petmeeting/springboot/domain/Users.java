package com.petmeeting.springboot.domain;

import com.petmeeting.springboot.enums.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.ColumnDefault;

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

    @Column(name = "user_id", unique = true, nullable = false, length = 50)
    private String userId;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "join_date", nullable = false)
    private Integer joinDate;

    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    @Column(name = "user_group", columnDefinition = "varchar(31)", nullable = false)
    private Role userGroup;

    @Column(name = "is_deleted", nullable = false)
    @ColumnDefault("false")
    private Boolean isDeleted;

    @Column(name = "is_activated", nullable = false)
    @ColumnDefault("true")
    private Boolean isActivated;

    // userGroup에 따라 default값이 다름
    @PrePersist
    private void prePersist(){
        this.isActivated = isActivated == null ?
                (this.userGroup.equals(Role.ROLE_SHELTER) ? false : true) : isActivated;
    }

    @Column(name = "image_path")
    private String imagePath;

    @Column(name = "refresh_token", length = 255)
    private String refreshToken;

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
