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
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DogServiceImpl implements DogService {

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
     * @param token
     * @return DogResDto
     */
    @Override
    @Transactional
    public DogResDto createDog(DogReqDto registerDogReqDto, String token) {
        log.info("[유기견 등록] 유기견 등록 요청");

        Integer userNo = jwtUtils.getUserNo(token);
        Users user = userRepository.findById(userNo).get();

        if(!(user instanceof Shelter)) {
            log.error("[유기견 등록] 보호소 회원이 아닙니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "보호소 회원이 아닙니다. 등록 권한이 없습니다.");
        };

        log.info("[유기견 등록] userId : {}", user.getUserId());

        Dog dog = Dog.builder()
                .shelter((Shelter) user)
                .name(registerDogReqDto.getName())
                .dogSize(DogSize.getSize(registerDogReqDto.getDogSize()))
                .gender(Gender.getGender(registerDogReqDto.getGender()))
                .weight(registerDogReqDto.getWeight())
                .age(registerDogReqDto.getAge())
                .personality(registerDogReqDto.getPersonality())
                .protectionStartDate(registerDogReqDto.getProtectionStartDate())
                .protectionEndDate(registerDogReqDto.getProtectionEndDate())
                .adoptionAvailability(AdoptionAvailability.getAvailability(registerDogReqDto.getAdoptionAvailability()))
                .currentStatus(registerDogReqDto.getCurrentStatus())
                .dogSpecies(registerDogReqDto.getDogSpecies())
                .reasonAbandonment(registerDogReqDto.getReasonAbandonment())
                .isInoculated(registerDogReqDto.getIsInoculated())
                .build();

        dogRepository.save(dog);

        log.info("[유기견 등록] dogNo : {}", dog.getDogNo());
        log.info("[유기견 등록] 유기견 등록 완료");

        return DogResDto.entityToDto(dog);
    }

    /**
     * 유기견 상세 조회
     * @param dogNo, token
     * @return DogResDto
     */
    @Override
    @Transactional
    public DogResDto findDog(Integer dogNo, String token) {
        log.info("[유기견 상세 조회] 유기견 상세 조회 요청");

        Integer userNo = jwtUtils.getUserNo(token);

        Dog dog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> {
                    log.error("[유기견 상세 조회] 유기견을 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다.");
                });

        log.info("[유기견 상세 조회] 유기견 상세 조회 완료");
        return DogResDto.entityToDto(dog);
    }

    /**
     * 유기견의 상태를 변경합니다.
     * userNo는 현재 로그인한 유저의 고유번호를 입력합니다.
     * 보호종료 상태로 변경될 시 해당 유기견에게 할당된 모든 입양신청서의 adoptionStatus가 “미채택”으로 변경됩니다.
     * @param dogStatusUpdateReqDto
     * @param token
     * @return DogResDto
     */
    @Override
    @Transactional
    public DogResDto updateDogStatus(Integer dogNo, DogStatusUpdateReqDto dogStatusUpdateReqDto, String token){
        log.info("[유기견 상태 변경] 유기견 상태 변경 요청");

        Integer userNo = jwtUtils.getUserNo(token);
        Users user = userRepository.findById(userNo).get();

        if(!(user instanceof Shelter)) {
            log.error("[유기견 상태 변경] 보호소를 찾을 수 없습니다.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "보호소를 찾을 수 없습니다.");
        }

        Dog dog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> {
                    log.error("[유기견 상태 변경] 유기견을 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다.");
                });

        if(!userNo.equals(dog.getShelter().getId())) {
            log.error("[유기견 상태 변경] 등록자와 수정자가 일치하지 않아 수정할 수 없습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "수정 권한이 없습니다.");
        }

        Boolean adoptImpossible = dog.updateStatus(AdoptionAvailability.valueOf(dogStatusUpdateReqDto.getAdoptionAvailability()));
        dogRepository.save(dog);

        // 만약 보호종료 상태가 된다면, 해당 유기견에게 할당된 모든 입양신청서 "미채택"
        if(adoptImpossible){
            Integer updateAdoptionCnt = adoptionRepository.updateAdoptionByDog(dog.getDogNo(), userNo);
            log.info("[유기견 상태 변경] 유기견이 보호종료되어 해당 유기견에게 할당된 모든 입양신청서 미채택 처리 {}개", updateAdoptionCnt);
        }

        log.info("[유기견 상태 변경] 유기견 상태 변경 완료");
        return DogResDto.entityToDto(dog);
    }

    /**
     * 유기견 정보 수정
     * 등록한 보호소와 수정자가 동일해야만 수정할 수 있습니다.
     * @param dogNo
     * @param registerDogReqDto
     * @param token
     * @return DogResDto
     */
    @Override
    @Transactional
    public DogResDto updateDog(Integer dogNo, DogReqDto registerDogReqDto, String token) {
        log.info("[유기견 수정] 유기견 수정 요청");

        Integer userNo = jwtUtils.getUserNo(token);
        Users user = userRepository.findById(userNo).get();

        if(!(user instanceof Shelter)) {
            log.error("[유기견 수정] 보호소를 찾을 수 없습니다.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "보호소를 찾을 수 없습니다.");
        }

        Dog dog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> {
                    log.error("[유기견 수정] 유기견을 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다.");
                });

        if(!userNo.equals(dog.getShelter().getId())) {
            log.error("[유기견 수정] 등록자와 수정자가 일치하지 않아 수정할 수 없습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "수정 권한이 없습니다.");
        }

        dog.updateDogInfo(registerDogReqDto);
        dogRepository.save(dog);

        log.info("[유기견 수정] 유기견 수정 완료");

        return DogResDto.entityToDto(dog);
    }

    /**
     * 유기견 삭제
     * @param dogNo
     * @param token
     */
    @Override
    @Transactional
    public void deleteDog(Integer dogNo, String token) {
        log.info("[유기견 삭제] 유기견 삭제 요청");

        Integer userNo = jwtUtils.getUserNo(token);
        Users user = userRepository.findById(userNo).get();

        if(!(user instanceof Shelter)) {
            log.error("[유기견 삭제] 보호소를 찾을 수 없습니다.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "보호소를 찾을 수 없습니다.");
        }

        Dog dog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> {
                    log.error("[유기견 삭제] 유기견을 찾을 수 없습니다.");
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다.");
                });

        if(!dog.getShelter().getId().equals(userNo)){
            log.error("[유기견 삭제] 등록자와 삭제자가 동일하지 않아 삭제할 수 없습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "권한이 없습니다.");
        }

        dog.delete();
        dogRepository.save(dog);

        log.info("[유기견 삭제] 유기견 삭제 완료");
    }

    /**
     * 유기견 조건 검색
     * @param condition
     * @return DogResDto
     */
    @Override
    @Transactional
    public List<DogResDto> findDogByCondition(DogSearchCondition condition) {
        log.info("[유기견 조건 검색] 유기견 조건 검색 요청");
        log.info("[유기견 조건 검색] condition : {}", condition.toString());
        log.info("[유기견 조건 검색] 유기견 조건 검색 완료");

        return dogQueryDslRepository.findByCondition(condition).stream()
                .map(dog -> DogResDto.entityToDto(dog))
                .collect(Collectors.toList());
    }

    /**
     * 유기견 전체 검색
     * @return DogResDto
     */
    @Override
    @Transactional
    public List<DogResDto> getAllDog() {
        log.info("[유기견 전체 검색] 유기견 전체 검색");

        return dogRepository.findDogByIsDeletedFalse().stream()
                .map(dog -> DogResDto.entityToDto(dog))
                .collect(Collectors.toList());
    }

    /**
     * 유기견 랭크 검색
     * @return DogResDto
     */
    @Override
    @Transactional
    public List<DogResDto> getAllDogOrderByRank() {
        log.info("[랭크 옵션에 따른 유기견 검색] 유기견 랭크 검색");

        return dogRepository.selectAllOrderByLikeCnt().stream()
                .map(dog -> DogResDto.entityToDto(dog))
                .collect(Collectors.toList());
    }

    /**
     * 유기견 랜덤 검색
     * @return DogResDto
     */
    @Override
    @Transactional
    public List<DogResDto> getAllDogByRandom() {
        log.info("[랜덤 옵션에 따른 유기견 검색] 유기견 랜덤 검색");

        return dogRepository.selectAllByRandom().stream()
                .map(dog -> DogResDto.entityToDto(dog))
                .collect(Collectors.toList());
    }

    /**
     * 유기견 좋아요 설정
     * 이미 좋아요 체크가 되어있을 경우 불가능
     * @param dogNo
     * @param token
     */
    @Override
    @Transactional
    public void likeDog(Integer dogNo, String token) {
        log.info("[유기견 좋아요] 유기견 좋아요 요청");

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

        Dog dog = dogRepository.findDogByDogNo(dogNo).get();

        dog.updateLikeCnt(true);
        dogRepository.save(dog);

        log.info("[유기견 좋아요] 유기견 좋아요 설정 => dogNo : {}, userNo : {}", dogNo, userNo);
        likeDogRepository.save(likeDog);

        log.info("[유기견 좋아요] 유기견 좋아요 완료");
    }

    /**
     * 유기견 좋아요 취소
     * 아직 좋아요 체크가 되어있지 않을 경우 불가능
     * @param dogNo
     * @param token
     */
    @Override
    @Transactional
    public void dislikeDog(Integer dogNo, String token) {
        log.info("[유기견 좋아요 취소] 유기견 좋아요 취소 요청");

        if(!checkLiked(dogNo, token)) {
            log.error("[유기견 좋아요 취소] 아직 좋아요를 누르지 않은 사용자입니다. ");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "아직 좋아요를 누르지 않았습니다.");
        }

        Integer userNo = jwtUtils.getUserNo(token);

        Dog dog = dogRepository.findDogByDogNo(dogNo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "유기견을 찾을 수 없습니다."));

        dog.updateLikeCnt(false);

        Integer dislikeCnt = likeDogRepository.deleteLikeDogByMemberNoAndDogNo(userNo, dogNo);
        log.info("[유기견 좋아요 취소] 유기견 좋아요 취소 {}개", dislikeCnt);

        dogRepository.save(dog);
        log.info("[유기견 좋아요 취소] 유기견 좋아요 취소 완료");
    }

    /**
     * 유기견 좋아요 체크
     * 좋아요가 이미 눌려있는지 체크
     * @param dogNo
     * @param token
     */
    @Override
    public Boolean checkLiked(Integer dogNo, String token){
        log.info("[유기견 좋아요 체크] 유기견 좋아요 체크 요청");

        Integer userNo = jwtUtils.getUserNo(token);

        log.info("[유기견 좋아요 체크] 유기견 좋아요 체크 완료");
        return likeDogRepository.existsLikeDogByMemberNoAndDogNo(userNo, dogNo);
    }

    /**
     * 유기견 찜 설정
     * 이미 찜 체크가 되어있을 경우 불가능
     * @param dogNo
     * @param token
     */
    @Override
    @Transactional
    public void bookmarkDog(Integer dogNo, String token) {
        log.info("[유기견 찜] 유기견 찜 요청");

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

        log.info("[유기견 찜] 유기견 찜 설정 => dogNo : {} , userNo : {}", dogNo, userNo);
        bookmarkDogRepository.save(bookmarkDog);

        log.info("[유기견 찜] 유기견 찜 완료");
    }

    /**
     * 유기견 찜 취소
     * 아직 찜 체크가 되어있지 않을 경우 불가능
     * @param dogNo
     * @param token
     */
    @Override
    @Transactional
    public void unbookmarkDog(Integer dogNo, String token) {
        log.info("[유기견 찜 취소] 유기견 찜 취소 요청");

        if(!checkBookmark(dogNo, token)) {
            log.error("[유기견 찜 취소] 아직 찜을 누르지 않은 사용자입니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "아직 찜을 누르지 않았습니다.");
        }

        Integer userNo = jwtUtils.getUserNo(token);

        Integer unbookmarkCnt = bookmarkDogRepository.deleteBookmarkDogByMemberNoAndDogNo(userNo, dogNo);
        log.info("[유기견 찜 취소] 유기견 찜 취소 {}개", unbookmarkCnt);
        log.info("[유기견 찜 취소] 유기견 찜 취소 완료");
    }

    /**
     * 유기견 찜 체크
     * 찜이 이미 눌려있는지 체크
     * @param dogNo
     * @param token
     * @return Boolean
     */
    @Override
    public Boolean checkBookmark(Integer dogNo, String token) {
        log.info("[유기견 찜 체크] 유기견 찜 체크 요청");

        Integer userNo = jwtUtils.getUserNo(token);

        log.info("[유기견 찜 체크] dogNo : {}, userNo : {}", dogNo, userNo);
        log.info("[유기견 찜 체크] 유기견 찜 체크 완료");
        return bookmarkDogRepository.existsBookmarkDogByMemberNoAndDogNo(userNo, dogNo);
    }

    /**
     * 유기견 찜 목록
     * 로그인 사용자가 찜한 유기견 목록 전체를 반환
     * @param token
     * @return List<DogResDto>
     */
    @Override
    public List<DogResDto> getBookmarkDogList(String token) {
        log.info("[유기견 찜 리스트 조회] 로그인한 사용자의 유기견 찜 리스트 전체조회 요청");
        Integer userNo = jwtUtils.getUserNo(token);

        log.info("[유기견 찜 리스트 조회] 로그인한 사용자의 유기견 찜 리스트 전체조회 완료");

        return dogRepository.selectAllFromBookmarkDog(userNo).stream()
                .map(dog -> DogResDto.entityToDto(dog))
                .collect(Collectors.toList());
    }

    /**
     * 유기견 좋아요 목록
     * 로그인 사용자가 좋아요한 유기견 목록 전체를 반환
     * @param token
     * @return List<DogResDto>
     */
    @Override
    public List<DogResDto> getLikeDogList(String token) {
        log.info("[유기견 좋아요 리스트 조회] 로그인한 사용자의 유기견 좋아요 리스트 전체조회 요청");
        Integer userNo = jwtUtils.getUserNo(token);

        log.info("[유기견 좋아요 리스트 조회] 로그인한 사용자의 유기견 좋아요 리스트 전체조회 완료");

        return dogRepository.selectAllFromLikeDog(userNo).stream()
                .map(dog -> DogResDto.entityToDto(dog))
                .collect(Collectors.toList());
    }
}
