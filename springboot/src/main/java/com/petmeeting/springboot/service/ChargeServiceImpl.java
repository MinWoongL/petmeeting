package com.petmeeting.springboot.service;

import com.petmeeting.springboot.domain.Charge;
import com.petmeeting.springboot.domain.Member;
import com.petmeeting.springboot.domain.Users;
import com.petmeeting.springboot.dto.charge.*;
import com.petmeeting.springboot.repository.ChargeRepository;
import com.petmeeting.springboot.repository.DonationRepository;
import com.petmeeting.springboot.repository.UserRepository;
import com.petmeeting.springboot.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChargeServiceImpl implements ChargeService {
    @Value("${kakao.admin_key}")
    private String ADMIN_KEY;
    @Value("${kakao.content_type}")
    private String CONTENT_TYPE;
    @Value("${kakao.cid}")
    private String CID;

    private final UserRepository userRepository;
    private final ChargeRepository chargeRepository;
    private final DonationRepository donationRepository;
    private final String KAKAO_READY_URL = "https://kapi.kakao.com/v1/payment/ready";
    private final JwtUtils jwtUtils;

    /**
     * 결제요청
     * 결제요청오면 카카오페이와 연결
     * @param chargeReadyReqDto
     * @param token
     * @return tid, redirect url
     */
    @Override
    public ChargeReadyResDto ready(ChargeReadyReqDto chargeReadyReqDto, String token) {
        log.info("[결제요청] 결제페이지 요청 시작. token : {}, {}", token, chargeReadyReqDto.toString());

        int userNo = jwtUtils.getUserNo(token);
        Users user = userRepository.findById(userNo).get();

        log.info("[결제요청] userId : {} / price : {}", user.getUserId(), chargeReadyReqDto.getSelectPoint());

        MultiValueMap<String, String> requestParams = new LinkedMultiValueMap<>();

        requestParams.add("cid", CID);
        requestParams.add("partner_order_id", "PetMeeting");
        requestParams.add("partner_user_id", user.getUserId());
        requestParams.add("item_name", chargeReadyReqDto.getSelectPoint() + "포인트 + "
                + chargeReadyReqDto.getSelectToken() + "토큰 충전하기");
        requestParams.add("quantity", "1");
        requestParams.add("total_amount", chargeReadyReqDto.getSelectPoint());
        requestParams.add("tax_free_amount", "0");
        requestParams.add("approval_url", chargeReadyReqDto.getApprovalUrl());
        requestParams.add("cancel_url", chargeReadyReqDto.getCancelUrl());
        requestParams.add("fail_url", chargeReadyReqDto.getFailUrl());

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestParams, this.getHeaders());

        RestTemplate restTemplate = new RestTemplate();

        KakaoReadyResDto kakaoReadyResDto = restTemplate
                .postForObject(KAKAO_READY_URL, requestEntity, KakaoReadyResDto.class);

        log.info("[결제요청] 결제페이지 반환. url : {}", kakaoReadyResDto.getNext_redirect_pc_url());
        return ChargeReadyResDto.builder()
                .tid(kakaoReadyResDto.getTid())
                .nextRedirectPcUrl(kakaoReadyResDto.getNext_redirect_pc_url()).build();
    }

    /**
     * 결제 검증
     * 결제완료 시 tid와 pg_token을 이용하여 결제내역 확인
     * @param chargeCheckReqDto
     * @param token
     * @return chargedPrice, chargedToken
     */
    @Override
    @Transactional
    public ChargeCheckResDto check(ChargeCheckReqDto chargeCheckReqDto, String token) {
        log.info("[결제검증] 결제 검증 요청. token : {}, {}", token, chargeCheckReqDto.toString());

        int userNo = jwtUtils.getUserNo(token);
        Member member = (Member) userRepository.findById(userNo).get();

        MultiValueMap<String, String> requestParams = new LinkedMultiValueMap<>();

        requestParams.add("cid", CID);
        requestParams.add("tid", chargeCheckReqDto.getTid());
        requestParams.add("partner_order_id", "PetMeeting");
        requestParams.add("partner_user_id", member.getUserId());
        requestParams.add("pg_token", chargeCheckReqDto.getPgToken());

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestParams, this.getHeaders());

        RestTemplate restTemplate = new RestTemplate();
        KakaoApproveResDto kakaoApproveResDto = restTemplate
                .postForObject("https://kapi.kakao.com/v1/payment/approve", requestEntity, KakaoApproveResDto.class);
        log.info("[결제검증] 결제 검증 요청 응답받음");

        int chargePrice = kakaoApproveResDto.getAmount().getTotal();
        int chargeToken = chargePrice <= 10000 ? 1 : (chargePrice <= 50000 ? 2 : 3); // 토큰 개수를 직접 입력받거나 표를 정해야 함.

        Charge charge = Charge.builder()
                .member(member)
                .tid(kakaoApproveResDto.getTid())
                .chargeValue(chargePrice)
                .chargeTime(System.currentTimeMillis() / 1000L)
                .build();

        chargeRepository.save(charge);
        log.info("[결제검증] 결제 검증 완료. userId : {}, chargePrice : {}, chargeToken : {}", member.getUserId(), chargePrice, chargeToken);

        member.chargeTokens(chargeToken);
        userRepository.save(member);
        log.info("[결제검증] 토큰 충전 완료. chargeToken : {}", chargeToken);

        return ChargeCheckResDto.builder()
                .price(chargePrice)
                .addToken(chargeToken)
                .holdingToken(member.getHoldingToken())
                .addPoint(chargePrice)
                .holdingPoint(chargeRepository.findSumByUserNo(userNo).orElse(0) - donationRepository.findSumByUserNo(userNo).orElse(0))
                .build();
    }

    /**
     * 결제 내역 불러오기
     * token에서 userNo를 불러와서 해당 유저의 history 가져오기
     * @param token
     * @return List<ChargeHistoryResDto>
     */
    @Override
    @Transactional
    public List<ChargeHistoryResDto> getHistory(String token) {
        log.info("[결제내역 확인] 결제내역 요청. token : {}", token);

        Member member = (Member) userRepository.findById(jwtUtils.getUserNo(token))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "사용자를 찾을 수 없습니다."));

        log.info("[결제내역 확인] 결제내역 확인 완료. userId : {}", member.getUserId());

        return member.getChargeList().stream()
                .map(m -> ChargeHistoryResDto.builder()
                        .chargeNo(m.getChargeNo())
                        .chargeValue(m.getChargeValue())
                        .chargeTime(m.getChargeTime())
                        .build())
                .collect(Collectors.toList());
    }

    private HttpHeaders getHeaders() {
        HttpHeaders httpHeaders = new HttpHeaders();

        String auth = "KakaoAK " + ADMIN_KEY;
        httpHeaders.set("Authorization", auth);
        httpHeaders.set("Content-Type", CONTENT_TYPE);

        return httpHeaders;
    }
}
