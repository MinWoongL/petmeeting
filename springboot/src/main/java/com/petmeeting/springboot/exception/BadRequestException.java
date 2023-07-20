package com.petmeeting.springboot.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String error) {
        super(error);
        System.out.println("error = " + error);
    }
}
