package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.LikeReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface LikeReplyRepository extends JpaRepository<LikeReply, Integer> {

    @Query(value = "select exists(select * from like_reply where user_no = :userNo and reply_no = :replyNo)", nativeQuery = true)
    Boolean existsLikeReplyByUserNoAndReplyNo(Integer userNo, Integer replyNo);

//    @Query(value = "delete from like_reply where user_no = :userNo and reply_no = :replyNo", nativeQuery = true)
    @Modifying
    Integer deleteLikeReplyByUserAndReply(Integer userNo, Integer replyNo);

}
