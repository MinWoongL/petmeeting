package com.petmeeting.springboot.domain;

import com.petmeeting.springboot.dto.adoption.AdoptionUpdateReqDto;
import com.petmeeting.springboot.enums.AdoptionStatus;
import com.petmeeting.springboot.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;

@Entity
@Getter
@Builder
@DynamicInsert
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelter_no")
    private Shelter shelter;

    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @Column(name = "gender", columnDefinition = "char(6)", nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "phone_number", length = 20, nullable = false)
    private String phoneNumber;

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

    @Column(name = "adoption_status", columnDefinition = "varchar(20)", nullable = false)
    @ColumnDefault("'WAITING'")
    @Enumerated(EnumType.STRING)
    private AdoptionStatus adoptionStatus;

    /**
     * 해당 유기견의 입양신청 상태가 "채택"으로 변경시 true 반환
     * @param adoptionStatus
     * @return
     */
    public Boolean updateAdoptionStatus(AdoptionStatus adoptionStatus){
        this.adoptionStatus = adoptionStatus;

        if(adoptionStatus.equals(AdoptionStatus.ADOPT_SUCCESS))
            return true;

        return false;
    }

    public void updateAdoption(AdoptionUpdateReqDto reqDto) {
        this.name = reqDto.getName() == null ? this.name : reqDto.getName();
        this.gender = reqDto.getGender() == null ? this.gender : Gender.valueOf(reqDto.getGender());
        this.age = reqDto.getAge() == null ? this.age : reqDto.getAge();
        this.phoneNumber = reqDto.getPhoneNumber() == null ? this.phoneNumber : reqDto.getPhoneNumber();
        this.callTime = reqDto.getCallTime() == null ? this.callTime : reqDto.getCallTime();
        this.residence = reqDto.getResidence() == null ? residence : reqDto.getResidence();
        this.job = reqDto.getJob() == null ? job : reqDto.getJob();
        this.petExperience = reqDto.getPetExperience() == null ? petExperience : reqDto.getPetExperience();
        this.additional = reqDto.getAdditional() == null ? additional : reqDto.getAdditional();
    }
}
