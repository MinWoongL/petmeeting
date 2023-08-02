package com.petmeeting.springboot.domain;

import com.petmeeting.springboot.dto.dog.RegisterDogReqDto;
import com.petmeeting.springboot.enums.AdoptionAvailability;
import com.petmeeting.springboot.enums.DogSize;
import com.petmeeting.springboot.enums.Gender;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Builder
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
public class Dog {
    @Id @GeneratedValue
    @Column(name = "dog_no")
    private Integer dogNo;

    // Shelter |---|| Dog
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelter_no")
    private Shelter shelter;

    @Column(name = "name", length = 20, nullable = false)
    private String name;

    @Column(name = "dog_size", columnDefinition = "varchar(10)", nullable = false)
    @Enumerated(EnumType.STRING)
    private DogSize dogSize;

    @Column(name = "gender", columnDefinition = "char(6)", nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "weight", nullable = false)
    private Integer weight;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "personality", length = 100)
    private String personality;

    @Column(name = "protection_start_date", nullable = false)
    private Long protectionStartDate;

    @Column(name = "protection_end_date")
    private Long protectionEndDate;

    @Column(name = "adoption_availability", columnDefinition = "varchar(20)", nullable = false)
    @Enumerated(EnumType.STRING)
    private AdoptionAvailability adoptionAvailability;

    @Column(name = "current_status", columnDefinition = "text")
    private String currentStatus;

    @Column(name = "dog_species", length = 40)
    private String dogSpecies;

    @Column(name = "reason_abandonment", length = 255)
    private String reasonAbandonment;

    @Column(name = "is_inoculated")
    private Boolean isInoculated;

    @Column(name = "is_deleted", nullable = false)
    @ColumnDefault("false")
    private Boolean isDeleted;

    @Column(name = "like_cnt", nullable = false)
    @ColumnDefault("0")
    private Integer likeCnt;

    // Dog |---|| a
    @Column(name = "image_path")
    private String imagePath;

    @OneToMany(mappedBy = "dog", fetch = FetchType.LAZY)
    private List<LikeDog> likeDogList;

    @OneToMany(mappedBy = "dog", fetch = FetchType.LAZY)
    private List<BookmarkDog> bookmarkDogList;

    @OneToMany(mappedBy = "dog", fetch = FetchType.LAZY)
    private List<Donation> donationList;

    @OneToMany(mappedBy = "dog", fetch = FetchType.LAZY)
    private List<Adoption> adoptionList;

    @PrePersist
    public void prePersist() {
        this.protectionStartDate = protectionStartDate == 0 ? System.currentTimeMillis() / 1000 : protectionStartDate;
    }

    public void delete(){
        this.isDeleted = true;
    }

    /**
     * '입양가능(ADOPT_POSSIBLE)' 또는 '보호종료(ADOPT_IMPOSSIBLE)'로만 상태 변경 가능하며,
     * '보호종료'시,
     * 해당 유기견의 보호종료날짜(protectionEndDate)가 현재 시각으로 자동 할당 후 true 반환
     *
     * '입양가능'시,
     * 해당 유기견의 보호종료날짜가 null로 변경 후 false 반환
     *
     *  AdoptionService에 의해 '입양완료(ADOPT_SUCCESS)'도 가능
     */
    public Boolean updateStatus(AdoptionAvailability adoptionAvailability){
        this.adoptionAvailability = adoptionAvailability;

        if(adoptionAvailability.equals(AdoptionAvailability.ADOPT_POSSIBLE)) {
            this.protectionEndDate = null;
            return false;
        }
        else {
            this.protectionEndDate = System.currentTimeMillis() / 1000;
            return true;
        }
    }

    public void updateDogInfo(RegisterDogReqDto updateDogReqDto){
        this.name = updateDogReqDto.getName() == null? this.name : updateDogReqDto.getName();
        this.dogSize = updateDogReqDto.getDogSize() == null? this.dogSize : DogSize.valueOf(updateDogReqDto.getDogSize());
        this.gender = updateDogReqDto.getGender() == null ? gender : Gender.valueOf(updateDogReqDto.getGender());
        this.weight = updateDogReqDto.getWeight() == null ? weight : updateDogReqDto.getWeight();
        this.age = updateDogReqDto.getAge() == null ? age : updateDogReqDto.getAge();
        this.personality = updateDogReqDto.getPersonality() == null ? personality : updateDogReqDto.getPersonality();
        this.protectionStartDate = updateDogReqDto.getProtectionStartDate() == null ? protectionStartDate : updateDogReqDto.getProtectionStartDate();
        this.protectionEndDate = updateDogReqDto.getProtectionEndDate() == null ? protectionEndDate : updateDogReqDto.getProtectionEndDate();
        this.adoptionAvailability = updateDogReqDto.getAdoptionAvailability() == null ? adoptionAvailability : AdoptionAvailability.valueOf(updateDogReqDto.getAdoptionAvailability());
        this.currentStatus = updateDogReqDto.getCurrentStatus() == null ? currentStatus : updateDogReqDto.getCurrentStatus();
        this.dogSpecies = updateDogReqDto.getDogSpecies() == null ? dogSpecies : updateDogReqDto.getDogSpecies();
        this.reasonAbandonment = updateDogReqDto.getReasonAbandonment() == null ? reasonAbandonment : updateDogReqDto.getReasonAbandonment();
        this.isInoculated = updateDogReqDto.getIsInoculated() == null ? isInoculated : updateDogReqDto.getIsInoculated();
        this.imagePath = updateDogReqDto.getImagePath() == null ? imagePath : updateDogReqDto.getImagePath();
        // 삭제는 (isDeleted)는 삭제 기능으로만 가능
    }

    public void updateLikeCnt(Boolean isLike) {
        if(isLike)
            this.likeCnt += 1;
        else
            this.likeCnt -= 1;
    }

}
