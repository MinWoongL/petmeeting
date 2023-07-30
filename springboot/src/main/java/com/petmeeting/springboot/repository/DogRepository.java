package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Dog;
import com.petmeeting.springboot.enums.DogSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DogRepository extends JpaRepository<Dog, Integer> {

    Optional<Dog> findDogByDogSize(DogSize dogSize);
    Optional<Dog> findDogByDogNo(Integer dogNo);

    List<Dog> findDogByIsDeletedFalse();


    // List<Dog>
    @Query(value = "SELECT D.DOG_NO, D.NAME, D.DOG_SIZE, D.GENDER, D.WEIGHT, D.AGE, D.PERSONALITY, D.PROTECTION_START_DATE, D.PROTECTION_END_DATE, D.ADOPTION_AVAILABILITY, D.CURRENT_STATUS, D.DOG_SPECIES, D.REASON_ABANDONMENT, D.IS_INOCULATED, D.IMAGE_PATH\n" +
            "FROM DOG D \n" +
            "JOIN BOOKMARK_DOG B \n" +
            "ON D.DOG_NO = :dogNo \n" +
            "WHERE B.MEMBER_NO = :memberNo", nativeQuery = true)
    List<Dog> selectAllJoinOnBookmarkDog(Integer dogNo, Integer memberNo);


}
