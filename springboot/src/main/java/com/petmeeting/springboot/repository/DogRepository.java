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

    // 로그인 사용자의 유기견 찜 리스트 조회
    @Query(value = "select * from dog where dog_no in (" +
            "select dog_no from bookmark_dog where member_no = :memberNo)", nativeQuery = true)
    List<Dog> selectAllFromBookmarkDog(Integer memberNo);

    // 로그인 사용자의 유기견 좋아요 리스트 조회
    @Query(value = "select * from dog where dog_no in (" +
            "select dog_no from like_dog where member_no = :memberNo)", nativeQuery = true)
    List<Dog> selectAllFromLikeDog(Integer memberNo);

    // 좋아요 상위권 강아지 순

//    List<Dog> selectAllFromLikeDogRank();


}
