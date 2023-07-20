package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Integer> {
    Optional<Users> findUsersByUserId(String userId);

    boolean existsByUserId(String userId);
}
