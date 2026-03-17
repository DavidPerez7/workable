package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.service.AspiranteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

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
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // READ
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(aspiranteService.getAll());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Aspirante aspirante = aspiranteService.getById(id);
            return ResponseEntity.ok(aspirante);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Aspirante aspirante) {
        try {
            return ResponseEntity.ok(aspiranteService.update(id, aspirante));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            aspiranteService.delete(id);
            return ResponseEntity.status(204).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // DELETE ME - Elimina su propia cuenta
    @DeleteMapping("/me/delete")
    public ResponseEntity<?> deleteMe() {
        try {
            aspiranteService.deleteMe();
            return ResponseEntity.status(204).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }
}