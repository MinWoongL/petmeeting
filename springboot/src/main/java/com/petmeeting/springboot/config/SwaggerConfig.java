package com.petmeeting.springboot.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        servers = {@Server(url = "https://i9a203.p.ssafy.io/", description = "Default Server URL")
                , @Server(url = "http://localhost:5000/", description = "Develop URL")},
        info = @Info(title = "PetMeeting API 명세서",
                description = "PetMeeting WebService API 명세서",
                version = "v1"))
@RequiredArgsConstructor
@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi chatOpenApi() {
        String[] paths = {"/api/**"};

        return GroupedOpenApi.builder()
                .group("PetMeeting WebService API v1")
                .pathsToMatch(paths)
                .build();
    }

}
