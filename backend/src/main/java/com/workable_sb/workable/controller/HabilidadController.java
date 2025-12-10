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
 * Controlador de Habilidades - Habilidades técnicas y profesionales del aspirante.
 * Roles permitidos:
 * - ASPIRANTE: Crear/editar/eliminar sus propias habilidades
 * - RECLUTADOR: Solo lectura de habilidades públicas
 * - ADMIN: Acceso completo
 */
@RestController
@RequestMapping("/api/habilidad")
public class HabilidadController {

    @Autowired
    private HabilidadService habilidadService;

    // ===== CREATE - Solo ASPIRANTE y ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PostMapping
    public ResponseEntity<?> crearHabilidad(@RequestBody Habilidad habilidad, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long aspiranteId = userDetails.getUsuarioId();
            return ResponseEntity.ok(habilidadService.crearHabilidad(habilidad, aspiranteId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear habilidad: " + e.getMessage()));
        }
    }

    // ===== READ by id - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Habilidad> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(habilidadService.obtenerPorId(id));
    }

    // ===== READ por usuario - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{aspiranteId}")
    public ResponseEntity<List<Habilidad>> obtenerHabilidadesPorUsuario(@PathVariable Long aspiranteId) {
        return ResponseEntity.ok(habilidadService.obtenerHabilidadesPorUsuario(aspiranteId));
    }

    // ===== READ todas - ADMIN solamente =====
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Habilidad>> listarTodas() {
        return ResponseEntity.ok(habilidadService.listarTodas());
    }

    // ===== READ habilidades del aspirante autenticado =====
    @PreAuthorize("hasRole('ASPIRANTE')")
    @GetMapping("/aspirante")
    public ResponseEntity<?> obtenerMisHabilidades(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long aspiranteId = userDetails.getUsuarioId();
            List<Habilidad> habilidades = habilidadService.obtenerHabilidadesPorUsuario(aspiranteId);
            return ResponseEntity.ok(habilidades);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener habilidades: " + e.getMessage()));
        }
    }

    // ===== UPDATE - Solo ASPIRANTE sus propias habilidades o ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarHabilidad(@PathVariable Long id, @RequestBody Habilidad habilidad, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long aspiranteId = userDetails.getUsuarioId();
            Habilidad habilidadExistente = habilidadService.obtenerPorId(id);
            
            // Validar ownership
            if (!habilidadExistente.getAspirante().getId().equals(aspiranteId)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes editar habilidades de otro usuario"));
            }
            
            return ResponseEntity.ok(habilidadService.actualizarHabilidad(id, habilidad, aspiranteId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar habilidad: " + e.getMessage()));
        }
    }

    // ===== DELETE - Solo ASPIRANTE sus propias habilidades o ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarHabilidad(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long aspiranteId = userDetails.getUsuarioId();
            Habilidad habilidad = habilidadService.obtenerPorId(id);
            
            // Validar ownership
            if (!habilidad.getAspirante().getId().equals(aspiranteId)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes eliminar habilidades de otro usuario"));
            }
            
            habilidadService.eliminarHabilidad(id, aspiranteId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar habilidad: " + e.getMessage()));
        }
    }
}
