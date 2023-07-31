package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Adoption;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.adoption.AdoptionCreateReqDto;
import com.petmeeting.springboot.dto.adoption.AdoptionCreateResDto;
import com.petmeeting.springboot.dto.adoption.AdoptionResDto;
import com.petmeeting.springboot.repository.AdoptionRepository;
import com.petmeeting.springboot.repository.DogRepository;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.transaction.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdoptionService {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final DogRepository dogRepository;
    private final AdoptionRepository adoptionRepository;

    @Transactional
    public AdoptionResDto createAdoption(AdoptionCreateReqDto adoptionCreateReqDto, String token) {
        Integer userNo = jwtUtils.getUserNo(token);
        Users user = userRepository.findById(userNo).get();

        if(!(user instanceof Member)) {
            log.error("[입양신청서 작성] 작성 권한이 없습니다.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "입양신청 권한이 없습니다.");
        }

        log.info("[입양신청서 작성] userId : {}", user.getUserId());

        Adoption adoption = adoptionCreateReqDto.toEntity((Member) user);
        adoptionRepository.save(adoption);

        return AdoptionResDto.entityToDto(adoption);
    }



}
