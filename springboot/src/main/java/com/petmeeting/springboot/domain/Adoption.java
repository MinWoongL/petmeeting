package com.petmeeting.springboot.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Adoption {
    @Id @GeneratedValue
    @Column(name = "adoption_no")
    private Integer adoptionNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_no")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dog_no")
    private Dog dog;

    // 보호소 고유번호 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelter_no")
    private Shelter shelter;


    @Column(name = "name", length = 50, nullable = false)
    private String name;

    // char(1) 확인해보기
    // check in (F, M)
    @Column(name = "gender", length = 1, nullable = false)
    private Gender gender;

    // 얘 왜 TINYINT?
    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "call_time", length = 255, nullable = false)
    private String callTime;

    @Column(name = "residence", length = 20, nullable = false)
    private String residence;

    @Column(name = "job", length = 50, nullable = false)
    private String job;

    @Column(name = "pet_experience", nullable = false)
    private Boolean petExperience;

    @Column(name = "additional", columnDefinition = "text")
    private String additional;

    @Column(name = "adoption_status", length = 20, nullable = false)
    @ColumnDefault("waiting")
    private String adoptionStatus;

}
