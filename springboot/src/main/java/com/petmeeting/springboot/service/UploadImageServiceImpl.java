package com.petmeeting.springboot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class UploadImageServiceImpl {

    // application.yml 에 정의된 spring.servlet.multipart.location 속성과 매핑되어 있는 값을 주입받음
    // 파일 업로드시 파일을 저장할 경로를 지정
    @Value("${spring.servlet.multipart.location}")
    private String uploadPath;

    public String uploadFile(MultipartFile file) throws IOException {

        File uploadDir = new File(uploadPath);

        if(!uploadDir.exists()){
            uploadDir.mkdirs();
        }

        // 파일 이름을 유니크한 값으로 생성(UUID)
        String newFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        file.transferTo(new File(uploadPath, newFileName));

        // 업로드된 파일의 경로를 문자열로 반환
        return uploadDir.getAbsolutePath() + File.separator + newFileName;
    }

}
