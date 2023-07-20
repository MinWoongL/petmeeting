package com.petmeeting.springboot.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    // Dog |---|| a
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "image_no")
    private Image image;

    @OneToMany(mappedBy = "dog", fetch = FetchType.LAZY)
    private List<LikeDog> likeDogList;

    @OneToMany(mappedBy = "dog", fetch = FetchType.LAZY)
    private List<BookmarkDog> bookmarkDogList;

    @OneToMany(mappedBy = "dog", fetch = FetchType.LAZY)
    private List<Donation> donationList;

    @OneToMany(mappedBy = "dog", fetch = FetchType.LAZY)
    private List<Adoption> adoptionList;


}
