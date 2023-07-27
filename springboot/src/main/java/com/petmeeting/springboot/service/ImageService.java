package com.petmeeting.springboot.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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

    // application.yml 에 정의된 spring.servlet.multipart.location 속성과 매핑되어 있는 값을 주입받음
    // 파일 업로드시 파일을 저장할 경로를 지정
    @Value("${spring.servlet.multipart.location}")
    private String uploadPath;

    public String uploadImage(MultipartFile image) throws IOException {

        File uploadDir = new File(uploadPath);

        // 폴더 없으면 폴더 생성
        if(!uploadDir.exists()){
            uploadDir.mkdirs();
        }

        // 파일 이름을 유니크한 값으로 생성(UUID)
        String newFileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();

        image.transferTo(new File(uploadPath, newFileName));

        // 업로드된 파일의 네임을 문자열로 반환
        return newFileName;
    }

    public Map<String, Object> getImage(String imageName){

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

}
