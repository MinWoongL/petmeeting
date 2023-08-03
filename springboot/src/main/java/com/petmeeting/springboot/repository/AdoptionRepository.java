package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Adoption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdoptionRepository extends JpaRepository<Adoption, Integer> {

    @Modifying
    @Query(value = "update adoption set adoption_status = 'ADOPT_FAIL' where dog_no = :dogNo and member_no <> :memberNo", nativeQuery = true)
    Integer updateAdoptionByDog(Integer dogNo, Integer memberNo);

    @Modifying
    Integer deleteAdoptionByAdoptionNo(Integer adoptionNo);

}
