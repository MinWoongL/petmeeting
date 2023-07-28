package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Integer> {
}
