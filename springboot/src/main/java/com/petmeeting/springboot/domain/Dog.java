package com.petmeeting.springboot.domain;

import com.petmeeting.springboot.enums.AdoptionAvailability;
import com.petmeeting.springboot.enums.DogSize;
import com.petmeeting.springboot.enums.Gender;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Builder
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
    private DogSize dogSize;

    @Column(name = "gender", columnDefinition = "char(1)", nullable = false)
    private Gender gender;

    @Column(name = "weight", nullable = false)
    private Integer weight;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "personality", length = 100)
    private String personality;

    @Column(name = "protection_start_date", nullable = false)
    private Integer protectionStartDate;

    @Column(name = "protection_end_date")
    private Integer protectionEndDate;

    @Column(name = "adoption_availability", columnDefinition = "varchar(20)", nullable = false)
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


}
