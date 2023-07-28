package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Integer> {
    Optional<Users> findUsersByUserId(String userId);
    boolean existsByUserId(String userId);

    @Query(value = "select * from users u inner join shelter s on u.user_no = s.user_no where u.user_group = 'Shelter'", nativeQuery = true)
    List<Users> findShelterUser();

    @Query(value = "select * from users u inner join shelter s on u.user_no = s.user_no where u.user_group = 'Shelter' and u.is_activated = false", nativeQuery = true)
    List<Users> findShelterUserWithDisabled();

    @Query(value = "select * from users u inner join member m on u.user_no = m.user_no where u.user_group = 'Member'", nativeQuery = true)
    List<Users> findMemberUser();
}
