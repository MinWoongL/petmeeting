package com.petmeeting.springboot.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {
    @GetMapping("/user")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String userAccess() {
        return "User Content";
    }
}
