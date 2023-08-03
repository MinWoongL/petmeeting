package com.petmeeting.springboot.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class ImageService {

    private final String BOARD_IMAGE_PATH = "/board";
    private final String MEMBER_IMAGE_PATH = "/member";
    private final String SHELTER_IMAGE_PATH = "/shelter";
    private final String REGIST_IMAGE_PATH = "/regist";
    private final String DOG_IMAGE_PATH = "/dog";

    public String uploadImage(MultipartFile image, String option) throws IOException {
        String uploadPath = selectPath(option);

        File uploadDir = new File(uploadPath);

        // 폴더 없으면 폴더 생성
        if(!uploadDir.exists()){
            uploadDir.mkdirs();
        }

        // 파일 이름을 유니크한 값으로 생성(UUID)
        String newFileName = UUID.randomUUID() + "_" + image.getOriginalFilename();

        image.transferTo(new File(uploadPath, newFileName));

        log.info("[이미지 저장] 이미지 저장 완료. imageName : {}", newFileName);
        // 업로드된 파일의 네임을 문자열로 반환
        return newFileName;
    }

    public Map<String, Object> getImage(String imageName, String option){
        String uploadPath = selectPath(option);

        log.info("[이미지 가져오기 확인] 메서드 실행");

        String imagePath = uploadPath + File.separator + imageName;
        Resource resource = new FileSystemResource(imagePath);

        if(!resource.exists()){
            log.error("[이미지 가져오기] 이미지 찾기 실패");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "이미지를 찾지 못했습니다 !!! ");
        }

        log.info("[이미지 가져오기] 성공");

        HttpHeaders header = new HttpHeaders();
        Path filePath = null;
        try {
            filePath = Paths.get(imagePath);
            header.add("Content-Type", Files.probeContentType(filePath));
        } catch (Exception e) {
            e.printStackTrace();
        }

        Map<String, Object> returnMap = new HashMap<>();
        returnMap.put("header", header);
        returnMap.put("resource", resource);

        return returnMap;
    }

    private String selectPath(String option) {
        switch (option) {
            case "board":
                return BOARD_IMAGE_PATH;
            case "member":
                return MEMBER_IMAGE_PATH;
            case "shelter":
                return SHELTER_IMAGE_PATH;
            case "regist":
                return REGIST_IMAGE_PATH;
            case "dog":
                return DOG_IMAGE_PATH;
        }
        log.error("[이미지] 유효하지 않은 옵션. option : {}", option);
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효하지 않은 option입니다.");
    }

}
