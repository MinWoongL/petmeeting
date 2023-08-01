package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Dog;
import com.petmeeting.springboot.enums.DogSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DogRepository extends JpaRepository<Dog, Integer> {

    Optional<Dog> findDogByDogNo(Integer dogNo);

    List<Dog> findDogByIsDeletedFalse();

    // 로그인 사용자의 유기견 찜 리스트 조회
    @Query(value = "select * from dog where dog_no in (" +
            "select dog_no from bookmark_dog where member_no = :memberNo)", nativeQuery = true)
    List<Dog> selectAllFromBookmarkDog(Integer memberNo);

    // 로그인 사용자의 유기견 좋아요 리스트 조회
    @Query(value = "select * from dog where dog_no in (" +
            "select dog_no from like_dog where member_no = :memberNo and is_deleted = false)", nativeQuery = true)
    List<Dog> selectAllFromLikeDog(Integer memberNo);

    // 좋아요 상위권 강아지 순 - 동일순위는 랜덤 정렬
    @Query(value = "select * from dog where is_deleted = false order by like_cnt desc, rand()", nativeQuery = true)
    List<Dog> selectAllOrderByLikeCnt();

    // 랜덤 목록 조회
    @Query(value = "select * from dog where is_deleted = false order by rand()", nativeQuery = true)
    List<Dog> selectAllByRandom();

}
