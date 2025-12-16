package com.workable_sb.workable.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.workable_sb.workable.models.Reclutador;
import com.workable_sb.workable.security.CustomUserDetails;
import com.workable_sb.workable.service.ReclutadorService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reclutador")
public class ReclutadorController {

    @Autowired
    private ReclutadorService reclutadorService;

    // ===== CREATE =====
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Reclutador reclutador) {
        try {
            Reclutador nuevoReclutador = reclutadorService.create(reclutador);
            return ResponseEntity.status(201).body(nuevoReclutador);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear reclutador: " + e.getMessage()));
        }
    }

    // ===== READ =====
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Reclutador> reclutadores = reclutadorService.getAll();
            return ResponseEntity.ok(reclutadores);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener reclutadores: " + e.getMessage()));
        }
    }

    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Reclutador reclutador = reclutadorService.getById(id);
            return ResponseEntity.ok(reclutador);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener reclutador: " + e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('RECLUTADOR')")
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal CustomUserDetails user) {
        try {
            Long usuarioId = user.getUsuarioId();
            Reclutador reclutador = reclutadorService.getById(usuarioId);
            return ResponseEntity.ok(reclutador);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener perfil: " + e.getMessage()));
        }
    }

    // ===== UPDATE =====
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Reclutador reclutador) {
        try {
            Reclutador reclutadorActualizado = reclutadorService.update(id, reclutador);
            return ResponseEntity.ok(reclutadorActualizado);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar reclutador: " + e.getMessage()));
        }
    }

    // ===== DELETE =====
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            reclutadorService.delete(id);
            return ResponseEntity.status(204).build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar reclutador: " + e.getMessage()));
        }
    }
}
