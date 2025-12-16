package com.workable_sb.workable.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.workable_sb.workable.models.Administrador;
import com.workable_sb.workable.service.AdministradorService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/administrador")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    // ===== CREATE =====
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Administrador administrador) {
        try {
            Administrador created = administradorService.create(administrador);
            return ResponseEntity.status(201).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // ===== READ =====
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Administrador admin = administradorService.getById(id);
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Administrador> admins = administradorService.getAll();
            return ResponseEntity.ok(admins);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // ===== UPDATE =====
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Administrador administrador) {
        try {
            Administrador updated = administradorService.update(id, administrador);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== DELETE =====
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            administradorService.delete(id);
            return ResponseEntity.status(204).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
}
