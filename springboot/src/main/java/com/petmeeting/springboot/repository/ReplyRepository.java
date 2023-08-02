package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Integer> {

    @Query(value = "select * from reply where board_no = :boardNo", nativeQuery = true)
    List<Reply> findAllByBoard(Integer boardNo);


}
