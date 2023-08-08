package com.petmeeting.springboot.service;

import com.petmeeting.springboot.dto.dog.DogReqDto;
import com.petmeeting.springboot.dto.dog.DogResDto;
import com.petmeeting.springboot.dto.dog.DogSearchCondition;
import com.petmeeting.springboot.dto.dog.DogStatusUpdateReqDto;

import java.util.List;

public interface DogService {
    DogResDto createDog(DogReqDto registerDogReqDto, String token);
    DogResDto findDog(Integer dogNo, String token);
    DogResDto updateDogStatus(Integer dogNo, DogStatusUpdateReqDto dogStatusUpdateReqDto, String token);
    DogResDto updateDog(Integer dogNo, DogReqDto registerDogReqDto, String token);
    void deleteDog(Integer dogNo, String token);
    List<DogResDto> findDogByCondition(DogSearchCondition condition);
    List<DogResDto> getAllDog();
    List<DogResDto> getAllDogOrderByRank();
    List<DogResDto> getAllDogByRandom();
    List<DogResDto> getLikedDogList(String token);
    void likeDog(Integer dogNo, String token);
    void dislikeDog(Integer dogNo, String token);
    Boolean checkLiked(Integer dogNo, String token);
    void bookmarkDog(Integer dogNo, String token);
    void unbookmarkDog(Integer dogNo, String token);
    Boolean checkBookmark(Integer dogNo, String token);
    List<DogResDto> getBookmarkDogList(String token);
    List<DogResDto> getLikeDogList(String token);
}
