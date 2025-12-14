package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.StatsDto;
import com.workable_sb.workable.service.LogService;
import com.workable_sb.workable.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminStatsController {

    @Autowired private StatsService statsService;
    @Autowired private LogService logService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<StatsDto> getStats() {
        try {
            StatsDto dto = statsService.collect();
            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            // Log to in-memory log service so admins can inspect errors
            String msg = ex.getMessage() != null ? ex.getMessage() : "Error collecting stats";
            String details = ex.toString();
            logService.add("ERROR", "BACKEND", msg, details);
            return ResponseEntity.status(500).body(null);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/logs")
    public ResponseEntity<List<LogService.LogEntry>> getLogs() {
        try {
            return ResponseEntity.ok(logService.recent());
        } catch (Exception ex) {
            // If reading or serializing logs fails, make sure we at least record it and return an empty list
            logService.add("ERROR", "BACKEND", "Failed to fetch logs: " + ex.getMessage(), ex.toString());
            return ResponseEntity.ok(java.util.Collections.emptyList());
        }
    }

    // Endpoint for frontend to post logs
    @PostMapping("/logs")
    public ResponseEntity<Void> postLog(@RequestBody LogService.LogEntry entry) {
        // Accept logs from frontend without auth (or with) - we keep it simple
        String level = entry.level == null ? "ERROR" : entry.level;
        String source = entry.source == null ? "FRONTEND" : entry.source;
        String message = entry.message == null ? "(empty)" : entry.message;
        String details = entry.details == null ? "" : entry.details;
        logService.add(level, source, message, details);
        return ResponseEntity.noContent().build();
    }
}
