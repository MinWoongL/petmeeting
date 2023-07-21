package com.petmeeting.springboot.domain;

import com.petmeeting.springboot.enums.Role;
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
//@NoArgsConstructor 기본생성자 아래 재생성
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
    private LocalDate joinDate;

    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    // 이렇게하는거 맞나???
    @Column(name = "user_group", columnDefinition = "String", nullable = false)
    private Role userGroup;

    @Column(name = "is_deleted", nullable = false)
    @ColumnDefault("false")
    private Boolean isDeleted;

    // *******************************************************************************************************

    // userGroup에 따라 default값이 다름
    // 따라서 @ColumnDefault 를 사용할 수 없어 메서드 생성
    @Column(name = "is_activated", nullable = false)
    private Boolean isActivated;

    public Users() {
        // userGroup에 따라 기본값 설정
        if (this.userGroup == Role.ROLE_SHELTER) {
            this.isActivated = false; // 보호소일 경우 수동 활성화(가입승인이 되어야 함)
        } else {
            this.isActivated = true; // 그 외의 경우 true로 설정
        }
    }

    // 여기 두희님 확인받아야함
    // *******************************************************************************************************

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
