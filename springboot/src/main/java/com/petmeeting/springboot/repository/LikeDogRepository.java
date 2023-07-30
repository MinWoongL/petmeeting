package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.LikeDog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface LikeDogRepository extends JpaRepository<LikeDog, Integer> {

    @Query(value = "select exists(select * from like_dog where dog_no = :dogNo and member_no = :memberNo)", nativeQuery = true)
    Boolean existsLikeDogByMemberNo(Integer memberNo, Integer dogNo);

    @Modifying
    @Query(value = "delete from like_dog where dog_no = :dogNo and member_no = :memberNo", nativeQuery = true)
    Integer deleteLikeDogByMemberNoAndDogNo(Integer memberNo, Integer dogNo);



}
