package com.workable_sb.workable.controller;

import com.workable_sb.workable.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionLogger {

    @Autowired private LogService logService;

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAll(Exception ex) {
        // Log exception details to LogService
        String msg = ex.getMessage();
        String details = ex.toString();
        logService.add("ERROR", "BACKEND", msg != null ? msg : "Exception", details);
        return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
    }
}
