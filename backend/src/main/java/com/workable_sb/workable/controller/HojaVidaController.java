package com.workable_sb.workable.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.workable_sb.workable.models.HojaVida;
import com.workable_sb.workable.service.HojaVidaService;

@RestController
@RequestMapping("/api/hoja-vida")
public class HojaVidaController {

    @Autowired
    private HojaVidaService hojaVidaService;

    // CREATE
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody HojaVida hojaVida) {
        try {
            HojaVida created = hojaVidaService.create(hojaVida);
            return ResponseEntity.status(201).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear hoja de vida: " + e.getMessage()));
        }
    }

    // READ
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<HojaVida> hojasVida = hojaVidaService.getAll();
            return ResponseEntity.ok(hojasVida);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener hojas de vida: " + e.getMessage()));
        }
    }

    // READ BY ID
    @PreAuthorize("hasAnyRole('ADMIN', 'ASPIRANTE')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            HojaVida hojaVida = hojaVidaService.getById(id);
            return ResponseEntity.ok(hojaVida);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener hoja de vida: " + e.getMessage()));
        }
    }

    // READ BY ASPIRANTE
    @PreAuthorize("hasAnyRole('ADMIN', 'ASPIRANTE')")
    @GetMapping("/aspirante/{aspiranteId}")
    public ResponseEntity<?> getByAspirante(@PathVariable Long aspiranteId) {
        try {
            HojaVida hojaVida = hojaVidaService.getByAspiranteId(aspiranteId);
            return ResponseEntity.ok(hojaVida);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener hoja de vida: " + e.getMessage()));
        }
    }

    // UPDATE
    @PreAuthorize("hasAnyRole('ADMIN', 'ASPIRANTE')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody HojaVida hojaVida) {
        try {
            HojaVida updated = hojaVidaService.update(id, hojaVida);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar hoja de vida: " + e.getMessage()));
        }
    }

    // DELETE
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            hojaVidaService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar: " + e.getMessage()));
        }
    }
}
