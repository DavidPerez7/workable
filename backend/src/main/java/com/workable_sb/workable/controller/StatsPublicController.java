package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.StatsDto;
import com.workable_sb.workable.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatsPublicController {

    @Autowired private StatsService statsService;

    // Protected public stats endpoint: only ADMIN can access
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/public")
    public ResponseEntity<StatsDto> getPublicStats() {
        StatsDto dto = statsService.collect();
        return ResponseEntity.ok(dto);
    }
}
