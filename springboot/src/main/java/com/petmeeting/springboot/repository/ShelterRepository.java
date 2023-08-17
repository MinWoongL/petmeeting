package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Shelter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShelterRepository extends JpaRepository<Shelter, Integer> {
    List<Shelter> findShelterByOnBroadCastTitleNotNull();
    List<Shelter> findShelterByIsDeletedFalse();
}
