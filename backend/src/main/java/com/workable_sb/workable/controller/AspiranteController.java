package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.service.AspiranteService;
import com.workable_sb.workable.security.CustomUserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/aspirante")
public class AspiranteController {

    @Autowired
    private AspiranteService aspiranteService;

    // CREATE
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Aspirante aspirante) {
        try {
            return ResponseEntity.status(201).body(aspiranteService.create(aspirante));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(aspiranteService.getAll());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Optional<Aspirante> aspirante = aspiranteService.getById(id);
            return aspirante.isPresent() ? ResponseEntity.ok(aspirante.get()) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Aspirante aspirante) {
        try {
            return ResponseEntity.ok(aspiranteService.update(id, aspirante));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            aspiranteService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}