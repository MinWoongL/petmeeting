package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.LikeBoard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface LikeBoardRepository extends JpaRepository<LikeBoard, Integer> {

    @Query(value = "select exists (select * from like_board where board_no = :boardNo and user_no = :userNo)", nativeQuery = true)
    Integer existsLikeBoardByUserNoAndBoardNo(Integer userNo, Integer boardNo);

    @Modifying
    @Query(value = "delete from like_board where board_no = :boardNo and user_no = :userNo", nativeQuery = true)
    Integer deleteLikeBoardByUserNoAndBoardNo(Integer userNo, Integer boardNo);
}
