package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Adoption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AdoptionRepository extends JpaRepository<Adoption, Integer> {

    @Query(value = "UPDATE Adoption adoption SET adoption.adoptionStatus = '미채택' WHERE adoption.dog.dogNo = ?1")
    Adoption updateAdoptionStatus(Integer dogNo);

}
