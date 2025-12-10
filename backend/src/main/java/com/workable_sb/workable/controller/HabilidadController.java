package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Habilidad;
import com.workable_sb.workable.service.HabilidadService;
import com.workable_sb.workable.security.CustomUserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador de Habilidades - CRUD simple para habilidades del aspirante.
 * Las habilidades son strings simples (máx 20 caracteres).
 * Solo ASPIRANTE puede crear/editar/eliminar sus propias habilidades.
 */
@RestController
@RequestMapping("/api/habilidad")
public class HabilidadController {

    @Autowired
    private HabilidadService habilidadService;

    // ===== READ habilidades del aspirante autenticado =====
    @PreAuthorize("hasRole('ASPIRANTE')")
    @GetMapping("/aspirante")
    public ResponseEntity<?> obtenerMisHabilidades(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long aspiranteId = userDetails.getUsuarioId();
            List<Habilidad> habilidades = habilidadService.obtenerHabilidadesPorUsuario(aspiranteId);
            return ResponseEntity.ok(habilidades);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== READ por usuario ID - público (para ver perfil de otros) =====
    @GetMapping("/usuario/{aspiranteId}")
    public ResponseEntity<?> obtenerHabilidadesPorUsuario(@PathVariable Long aspiranteId) {
        try {
            List<Habilidad> habilidades = habilidadService.obtenerHabilidadesPorUsuario(aspiranteId);
            return ResponseEntity.ok(habilidades);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== READ by id =====
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(habilidadService.obtenerPorId(id));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== CREATE - Solo ASPIRANTE =====
    @PreAuthorize("hasRole('ASPIRANTE')")
    @PostMapping
    public ResponseEntity<?> crearHabilidad(@RequestBody Habilidad habilidad, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long aspiranteId = userDetails.getUsuarioId();
            Habilidad nueva = habilidadService.crearHabilidad(habilidad, aspiranteId);
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== UPDATE - Solo ASPIRANTE sus propias habilidades =====
    @PreAuthorize("hasRole('ASPIRANTE')")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarHabilidad(@PathVariable Long id, @RequestBody Habilidad habilidad, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long aspiranteId = userDetails.getUsuarioId();
            Habilidad actualizada = habilidadService.actualizarHabilidad(id, habilidad, aspiranteId);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== DELETE - Solo ASPIRANTE sus propias habilidades =====
    @PreAuthorize("hasRole('ASPIRANTE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarHabilidad(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long aspiranteId = userDetails.getUsuarioId();
            habilidadService.eliminarHabilidad(id, aspiranteId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}
