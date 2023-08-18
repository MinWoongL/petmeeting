package com.petmeeting.springboot.repository;

import com.petmeeting.springboot.domain.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Integer> {
    @Query(value = "select * from chat where shelter_no = :shelterNo order by chat_no desc", nativeQuery = true)
    List<Chat> findChatByShelterNo(Integer shelterNo);
}
