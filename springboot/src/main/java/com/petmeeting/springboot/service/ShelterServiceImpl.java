package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Chat;
import com.petmeeting.springboot.domain.Shelter;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.shelter.ChatReqDto;
import com.petmeeting.springboot.dto.shelter.ChatResDto;
import com.petmeeting.springboot.dto.shelter.ShelterResDto;
import com.petmeeting.springboot.dto.shelter.ShelterSearchCondition;
import com.petmeeting.springboot.repository.ChatRepository;
import com.petmeeting.springboot.repository.ShelterQueryDslRepository;
import com.petmeeting.springboot.repository.ShelterRepository;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ShelterServiceImpl implements ShelterService {
    private final ShelterRepository shelterRepository;
    private final ShelterQueryDslRepository shelterQueryDslRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    /**
     * 보호소 아이디로 보호소 검색
     * @param shelterNo
     * @return ShelterResDto
     */
    @Transactional
    public ShelterResDto getShelter(Integer shelterNo) {
        log.info("[보호소 아이디로 검색] 아이디로 검색 요청. shelterNo : {}", shelterNo);
        Shelter shelter = shelterRepository.findById(shelterNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "보호소를 찾을 수 없습니다."));

        if (shelter.getIsDeleted()) {
            log.error("[보호소 아이디로 검색] 탈퇴한 보호소입니다.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "탈퇴한 보호소입니다.");
        }

        log.info("[보호소 아이디로 검색] 검색 결과 반환.");
        return ShelterResDto.builder()
                .name(shelter.getName())
                .phoneNumber(shelter.getPhoneNumber())
                .joinDate(shelter.getJoinDate())
                .imagePath(shelter.getImagePath())
                .location(shelter.getLocation())
                .siteUrl(shelter.getSiteUrl())
                .build();
    }

    /**
     * 모든 보호소 검색
     * 삭제된 보호소는 반환하지 않는다.
     * @return List<ShelterResDto>
     */
    @Transactional
    public List<ShelterResDto> getAllShelter() {
        log.info("[보호소 전체 검색] 모든 보호소 검색");
        return shelterRepository.findShelterByIsDeletedFalse().stream()
                .map(shelter -> ShelterResDto.builder()
                        .shelterNo(shelter.getId())
                        .name(shelter.getName())
                        .location(shelter.getLocation())
                        .siteUrl(shelter.getSiteUrl())
                        .imagePath(shelter.getImagePath())
                        .joinDate(shelter.getJoinDate())
                        .phoneNumber(shelter.getPhoneNumber())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 검색 조건으로 보호소 검색
     * @param condition
     * @return List<ShelterResDto>
     */
    @Transactional
    public List<ShelterResDto> getShelterByCondition(ShelterSearchCondition condition) {
        log.info("[보호소 검색조건으로 검색] condition : {}", condition.toString());

        return shelterQueryDslRepository.findByCondition(condition).stream()
                .map(shelter -> ShelterResDto.builder()
                        .shelterNo(shelter.getId())
                        .name(shelter.getName())
                        .location(shelter.getLocation())
                        .siteUrl(shelter.getSiteUrl())
                        .imagePath(shelter.getImagePath())
                        .joinDate(shelter.getJoinDate())
                        .phoneNumber(shelter.getPhoneNumber())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 보호소 고유번호로 채팅 목록 불러오기
     * @param shelterNo
     * @return List<ChatResDto>
     */
    @Transactional
    public List<ChatResDto> getChatList(Integer shelterNo) {
        log.info("[보호소 채팅목록] 채팅목록 불러오기");

        return chatRepository.findChatByShelterNo(shelterNo).stream()
                .map(chat -> {
                    Users user = chat.getUser();
                    return ChatResDto.builder()
                            .chatNo(chat.getChatNo())
                            .userNo(user.getId())
                            .userName(user.getName())
                            .createdTime(chat.getCreatedTime())
                            .content(chat.getContent())
                            .build();
                }).collect(Collectors.toList());
    }

    @Transactional
    public void registChat(ChatReqDto chatReqDto, String token) {
        log.info("[보호소 채팅 등록] 보호소 채팅 등록 요청");

        Shelter shelter = shelterRepository.findById(chatReqDto.getShelterNo())
                .orElseThrow(() -> {
                    log.error("[보호소 채팅 등록] 보호소 찾기 실패");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "보호소를 찾을 수 없습니다.");
                });

        Users user = userRepository.findById(jwtUtils.getUserNo(token)).get();

        Chat chat = Chat.builder()
                .shelter(shelter)
                .content(chatReqDto.getContent())
                .user(user)
                .createdTime(System.currentTimeMillis() / 1000L)
                .build();

        chatRepository.save(chat);

        log.info("[보호소 채팅 등록] 등록 완료");
    }
}
