package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.*;
import com.petmeeting.springboot.dto.dog.*;
import com.petmeeting.springboot.enums.AdoptionAvailability;
import com.petmeeting.springboot.enums.DogSize;
import com.petmeeting.springboot.enums.Gender;
import com.petmeeting.springboot.repository.*;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DogService {

    private final JwtUtils jwtUtils;
    private final DogRepository dogRepository;
    private final UserRepository userRepository;
    private final AdoptionRepository adoptionRepository;
    private final DogQueryDslRepository dogQueryDslRepository;
    private final LikeDogRepository likeDogRepository;
    private final BookmarkDogRepository bookmarkDogRepository;

    /**
     * 유기견 등록
     * @param registerDogReqDto
     * @return registerDogResDto
     */
    @Transactional
    public Map<String, Object> registerDog(RegisterDogReqDto registerDogReqDto, String token){
        Shelter shelter = (Shelter) userRepository.findById(jwtUtils.getUserNo(token))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "보호소를 찾을 수 없습니다."));

        Dog dog = Dog.builder()
                .shelter(shelter)
                .name(registerDogReqDto.getName())
                .dogSize(DogSize.valueOf(registerDogReqDto.getDogSize()))
                .gender(Gender.valueOf(registerDogReqDto.getGender()))
                .weight(registerDogReqDto.getWeight())
                .age(registerDogReqDto.getAge())
                .personality(registerDogReqDto.getPersonality())
                .protectionStartDate(registerDogReqDto.getProtectionStartDate())
                .protectionEndDate(registerDogReqDto.getProtectionEndDate())
                .adoptionAvailability(AdoptionAvailability.valueOf(registerDogReqDto.getAdoptionAvailability()))
                .currentStatus(registerDogReqDto.getCurrentStatus())
                .dogSpecies(registerDogReqDto.getDogSpecies())
                .reasonAbandonment(registerDogReqDto.getReasonAbandonment())
                .isInoculated(registerDogReqDto.getIsInoculated())
                .build();

        dogRepository.save(dog);

        Map<String, Object> result = new HashMap<>();
        result.put("dog", DogResDto.dogToDto(dog));

        return result;
    }

    @Transactional
    public Map<String, Object> findDog(Integer dogNo, String token) {
        // 로그인한 사람만 상세볼수있으니까 User인지 확인
        Users user = userRepository.findById(jwtUtils.getUserNo(token))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "권한이 없습니다."));

        Dog dog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다."));

        Map<String, Object> result = new HashMap<>();
        result.put("dog", DogResDtoNotHaveDogNo.dogToDto(dog));

        return result;
    }

    /**
     * 유기견의 상태를 변경합니다.
     * userNo는 현재 로그인한 유저의 고유번호를 입력합니다.
     * 보호종료 상태로 변경될 시 해당 유기견에게 할당된 모든 입양신청서의 adoptionStatus가 “미채택”으로 변경됩니다.
     * @param dogStatusUpdateReqDto
     * @param token
     * @return
     */
    @Transactional
    public Map<String, Object> updateDogStatus(Integer dogNo, DogStatusUpdateReqDto dogStatusUpdateReqDto, String token){

        Shelter shelter = (Shelter) userRepository.findById(jwtUtils.getUserNo(token))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "보호소를 찾을 수 없습니다."));

        Dog updateDog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "강아지를 찾을 수 없습니다."));

        if(shelter.getId() != updateDog.getShelter().getId()){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "수정 권한이 없습니다.");
        }

        updateDog.updateStatus(AdoptionAvailability.valueOf(dogStatusUpdateReqDto.getAdoptionAvailability()));
        dogRepository.save(updateDog);

//        // 만약 보호종료 상태가 된다면, 해당 유기견에게 할당된 모든 입양신청서 "미채택"
//        if(dogStatusUpdateReqDto.getAdoptionAvailability().equals(AdoptionAvailability.ADOPT_IMPOSSIBLE)){
//            Adoption adoption = adoptionRepository.updateAdoptionStatus(updateDog.getDogNo());
//            adoptionRepository.save(adoption);
//        }

        Map<String, Object> result = new HashMap<>();
        result.put("dog", DogResDtoNotHaveDogNo.dogToDto(updateDog));

        return result;
    }

    @Transactional
    public DogResDtoNotHaveDogNo updateDog(Integer dogNo, RegisterDogReqDto registerDogReqDto, String token) {
        Shelter shelter = (Shelter) userRepository.findById(jwtUtils.getUserNo(token))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "보호소를 찾을 수 없습니다."));

        Dog updateDog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "강아지를 찾을 수 없습니다."));

        if(shelter.getId() != updateDog.getShelter().getId()){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "수정 권한이 없습니다.");
        }

        updateDog.updateDogInfo(registerDogReqDto);
        dogRepository.save(updateDog);

        return DogResDtoNotHaveDogNo.dogToDto(updateDog);
    }

    @Transactional
    public void deleteDog(Integer dogNo, String token) {
        Dog dog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다."));

        // 1. 로그인 유저가 보호소 유저면서 (X) controller에서할거야
        // 2. 해당 유기견을 등록한 보호소와 동일한지
        Shelter shelter = (Shelter) userRepository.findById(jwtUtils.getUserNo(token))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "보호소를 찾을 수 없습니다."));

        if(dog.getShelter().getId() != shelter.getId()){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "권한 없음(해당 보호소의 갱얼쥐가 아님)");
        }

        dog.delete();
        dogRepository.save(dog);
    }

    @Transactional
    public List<DogResDto> findDogByCondition(DogSearchCondition condition) {
        log.info("[강아지 검색조건으로 검색] condition : {}", condition.toString());

        return dogQueryDslRepository.findByCondition(condition).stream()
                .map(dog -> DogResDto.builder()
                        .dogNo(dog.getDogNo())
                        .name(dog.getName())
                        .dogSize(dog.getDogSize().getValue())
                        .gender(dog.getGender().getValue())
                        .weight(dog.getWeight())
                        .age(dog.getAge())
                        .personality(dog.getPersonality())
                        .protectionStartDate(dog.getProtectionStartDate())
                        .protectionEndDate(dog.getProtectionEndDate())
                        .adoptionAvailability(dog.getAdoptionAvailability().getValue())
                        .currentStatus(dog.getCurrentStatus())
                        .dogSpecies(dog.getDogSpecies())
                        .reasonAbandonment(dog.getReasonAbandonment())
                        .isInoculated(dog.getIsInoculated())
                        .imagePath(dog.getImagePath())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public List<DogResDto> getAllDog() {
        log.info("[모든 강아지 검색]");

        return dogRepository.findDogByIsDeletedFalse().stream()
                .map(dog -> DogResDto.builder()
                        .dogNo(dog.getDogNo())
                        .name(dog.getName())
                        .dogSize(dog.getDogSize().getValue())
                        .gender(dog.getGender().getValue())
                        .weight(dog.getWeight())
                        .age(dog.getAge())
                        .personality(dog.getPersonality())
                        .protectionStartDate(dog.getProtectionStartDate())
                        .protectionEndDate(dog.getProtectionEndDate())
                        .adoptionAvailability(dog.getAdoptionAvailability().getValue())
                        .currentStatus(dog.getCurrentStatus())
                        .dogSpecies(dog.getDogSpecies())
                        .reasonAbandonment(dog.getReasonAbandonment())
                        .isInoculated(dog.getIsInoculated())
                        .imagePath(dog.getImagePath())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public List<DogResDto> getAllDogOrderByRank() {
        log.info("[랭크 옵션에 따른 모든 강아지 검색]");

        return dogRepository.selectAllOrderByLikeCnt().stream()
                .map(dog -> DogResDto.builder()
                        .dogNo(dog.getDogNo())
                        .name(dog.getName())
                        .dogSize(dog.getDogSize().getValue())
                        .gender(dog.getGender().getValue())
                        .weight(dog.getWeight())
                        .age(dog.getAge())
                        .personality(dog.getPersonality())
                        .protectionStartDate(dog.getProtectionStartDate())
                        .protectionEndDate(dog.getProtectionEndDate())
                        .adoptionAvailability(dog.getAdoptionAvailability().getValue())
                        .currentStatus(dog.getCurrentStatus())
                        .dogSpecies(dog.getDogSpecies())
                        .reasonAbandonment(dog.getReasonAbandonment())
                        .isInoculated(dog.getIsInoculated())
                        .imagePath(dog.getImagePath())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public List<DogResDto> getAllDogByRandom() {
        log.info("[랜덤 옵션에 따른 모든 강아지 검색]");

        return dogRepository.selectAllByRandom().stream()
                .map(dog -> DogResDto.builder()
                        .dogNo(dog.getDogNo())
                        .name(dog.getName())
                        .dogSize(dog.getDogSize().getValue())
                        .gender(dog.getGender().getValue())
                        .weight(dog.getWeight())
                        .age(dog.getAge())
                        .personality(dog.getPersonality())
                        .protectionStartDate(dog.getProtectionStartDate())
                        .protectionEndDate(dog.getProtectionEndDate())
                        .adoptionAvailability(dog.getAdoptionAvailability().getValue())
                        .currentStatus(dog.getCurrentStatus())
                        .dogSpecies(dog.getDogSpecies())
                        .reasonAbandonment(dog.getReasonAbandonment())
                        .isInoculated(dog.getIsInoculated())
                        .imagePath(dog.getImagePath())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 유기견 좋아요 설정
     * 이미 좋아요 체크가 되어있을 경우 불가능
     * @param dogNo
     * @param token
     */
    @Transactional
    public void likeDog(Integer dogNo, String token) {
        if(checkLiked(dogNo, token)) {
            log.error("[유기견 좋아요] 이미 좋아요를 누른 사용자입니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "이미 좋아요를 눌렀습니다.");
        }

        Integer userNo = jwtUtils.getUserNo(token);

        LikeDog likeDog = LikeDog.builder()
                .dog(dogRepository.findDogByDogNo(dogNo).orElseThrow(() -> {
                    log.error("[유기견 좋아요] 유기견을 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다.");
                }))
                .member((Member) userRepository.findById(userNo).get())
                .build();

        Dog dog = dogRepository.findDogByDogNo(dogNo)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다."));

        dog.updateLikeCnt(true);
        dogRepository.save(dog);

        log.info("[유기견 좋아요] 유기견 좋아요 설정. dogNo : {}, userNo : {}", dogNo, userNo);
        likeDogRepository.save(likeDog);
    }

    /**
     * 유기견 좋아요 취소
     * 아직 좋아요 체크가 되어있지 않을 경우 불가능
     * @param dogNo
     * @param token
     */
    @Transactional
    public void dislikeDog(Integer dogNo, String token) {
        if(!checkLiked(dogNo, token)) {
            log.error("[유기견 좋아요] 아직 좋아요를 누르지 않은 사용자입니다. ");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "아직 좋아요를 누르지 않았습니다.");
        }

        Integer userNo = jwtUtils.getUserNo(token);

        Integer dislikeCnt = likeDogRepository.deleteLikeDogByMemberNoAndDogNo(userNo, dogNo);
        log.info("[유기견 좋아요 취소] 유기견 좋아요 취소 완료. {}개", dislikeCnt);

        Dog dog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다."));

        dog.updateLikeCnt(false);
        dogRepository.save(dog);
    }

    /**
     * 유기견 좋아요 체크
     * 좋아요가 이미 눌려있는지 체크
     * @param dogNo
     * @param token
     */
    public Boolean checkLiked(Integer dogNo, String token){
        Integer userNo = jwtUtils.getUserNo(token);

        log.info("[유기견 좋아요 체크] dogNo : {}, userNo : {}", dogNo, userNo);
        return likeDogRepository.existsLikeDogByMemberNoAndDogNo(userNo, dogNo);
    }

    /**
     * 유기견 찜 설정
     * 이미 찜 체크가 되어있을 경우 불가능
     * @param dogNo
     * @param token
     */
    @Transactional
    public void bookmarkDog(Integer dogNo, String token) {
        if(checkBookmark(dogNo, token)) {
            log.error("[유기견 찜] 이미 찜을 누른 사용자입니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "이미 찜을 눌렀습니다.");
        }

        Integer userNo = jwtUtils.getUserNo(token);

        BookmarkDog bookmarkDog = BookmarkDog.builder()
                .dog(dogRepository.findDogByDogNo(dogNo).orElseThrow(() -> {
                    log.error("[유기견 찜] 유기견을 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다.");
                }))
                .member((Member) userRepository.findById(userNo).get())
                .build();

        log.info("[유기견 찜] 유기견 찜 설정 완료. dogNo : {} , userNo : {}", dogNo, userNo);
        bookmarkDogRepository.save(bookmarkDog);
    }

    /**
     * 유기견 찜 취소
     * 아직 찜 체크가 되어있지 않을 경우 불가능
     * @param dogNo
     * @param token
     */
    @Transactional
    public void unbookmarkDog(Integer dogNo, String token) {
        if(!checkBookmark(dogNo, token)) {
            log.error("[유기견 찜 취소] 아직 찜을 누르지 않은 사용자입니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "아직 찜을 누르지 않았습니다.");
        }

        Integer userNo = jwtUtils.getUserNo(token);

        Integer unbookmarkCnt = bookmarkDogRepository.deleteBookmarkDogByMemberNoAndDogNo(userNo, dogNo);
        log.info("[유기견 찜 취소] 유기견 찜 취소 완료. {}개", unbookmarkCnt);
    }

    /**
     * 유기견 찜 체크
     * 찜이 이미 눌려있는지 체크
     * @param dogNo
     * @param token
     * @return
     */
    public Boolean checkBookmark(Integer dogNo, String token) {
        Integer userNo = jwtUtils.getUserNo(token);

        log.info("[유기견 찜 체크] dogNo : {}, userNo : {}", dogNo, userNo);
        return bookmarkDogRepository.existsBookmarkDogByMemberNoAndDogNo(userNo, dogNo);
    }

    /**
     * 유기견 찜 목록
     * 로그인 사용자가 찜한 유기견 목록 전체를 반환
     * @param token
     * @return
     */
    public List<DogResDto> getBookmarkDogList(String token) {
        log.info("[유기견 찜 리스트 조회] 로그인한 사용자의 유기견 찜 리스트 전체조회");
        Integer userNo = jwtUtils.getUserNo(token);

        return dogRepository.selectAllFromBookmarkDog(userNo).stream()
                .map(dog -> DogResDto.builder()
                        .dogNo(dog.getDogNo())
                        .name(dog.getName())
                        .dogSize(dog.getDogSize().getValue())
                        .gender(dog.getGender().getValue())
                        .weight(dog.getWeight())
                        .age(dog.getAge())
                        .personality(dog.getPersonality())
                        .protectionStartDate(dog.getProtectionStartDate())
                        .protectionEndDate(dog.getProtectionEndDate())
                        .adoptionAvailability(dog.getAdoptionAvailability().getValue())
                        .currentStatus(dog.getCurrentStatus())
                        .dogSpecies(dog.getDogSpecies())
                        .reasonAbandonment(dog.getReasonAbandonment())
                        .isInoculated(dog.getIsInoculated())
                        .imagePath(dog.getImagePath())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 유기견 좋아요 목록
     * 로그인 사용자가 좋아요한 유기견 목록 전체를 반환
     * @param token
     * @return
     */
    public List<DogResDto> getLikeDogList(String token) {
        log.info("[유기견 좋아요 리스트 조회] 로그인한 사용자의 유기견 좋아요 리스트 전체조회");
        Integer userNo = jwtUtils.getUserNo(token);

        return dogRepository.selectAllFromLikeDog(userNo).stream()
                .map(dog -> DogResDto.builder()
                        .dogNo(dog.getDogNo())
                        .name(dog.getName())
                        .dogSize(dog.getDogSize().getValue())
                        .gender(dog.getGender().getValue())
                        .weight(dog.getWeight())
                        .age(dog.getAge())
                        .personality(dog.getPersonality())
                        .protectionStartDate(dog.getProtectionStartDate())
                        .protectionEndDate(dog.getProtectionEndDate())
                        .adoptionAvailability(dog.getAdoptionAvailability().getValue())
                        .currentStatus(dog.getCurrentStatus())
                        .dogSpecies(dog.getDogSpecies())
                        .reasonAbandonment(dog.getReasonAbandonment())
                        .isInoculated(dog.getIsInoculated())
                        .imagePath(dog.getImagePath())
                        .build())
                .collect(Collectors.toList());
    }
}
