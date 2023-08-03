package com.petmeeting.springboot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class RedisController {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @PostMapping
    public String postTest(String key, String value) {
        ValueOperations<String, String> vop = redisTemplate.opsForValue();
        vop.set(key, value);
        return "ok";
    }

    @GetMapping
    public String getTest(String key) {
        ValueOperations<String, String> vop = redisTemplate.opsForValue();
        return vop.get(key);
    }
}
