


package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.service.ExperienciaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.workable_sb.workable.security.CustomUserDetails;

import java.util.List;
import java.util.Map;

/**
 * Controlador de Experiencia Laboral - Historial laboral del aspirante.
 * Roles permitidos:
 * - ASPIRANTE: Crear/editar/eliminar sus propias experiencias
 * - RECLUTADOR: Solo lectura de experiencias públicas
 * - ADMIN: Acceso completo
 */
@RestController
@RequestMapping("/api/experiencia")
public class ExperienciaController {

    @Autowired
    private ExperienciaService experienciaService;

    // ===== CREATE - Solo ASPIRANTE y ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PostMapping
    public ResponseEntity<?> crearExperiencia(@RequestBody Experiencia experiencia, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long aspiranteIdActual = userDetails.getUsuarioId();
            // Solo se permite que el usuario cree sus propias experiencias
            return ResponseEntity.ok(experienciaService.crearExperiencia(experiencia, aspiranteIdActual));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear experiencia: " + e.getMessage()));
        }
    }

    // ===== READ by id - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Experiencia> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(experienciaService.obtenerPorId(id));
    }

    // ===== READ por usuario - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{aspiranteId}")
    public ResponseEntity<List<Experiencia>> obtenerExperienciasPorUsuario(@PathVariable Long aspiranteId) {
        return ResponseEntity.ok(experienciaService.obtenerExperienciasPorUsuario(aspiranteId));
    }

    // ===== READ activas por usuario - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{aspiranteId}/activas")
    public ResponseEntity<List<Experiencia>> obtenerExperienciasActivas(@PathVariable Long aspiranteId) {
        return ResponseEntity.ok(experienciaService.obtenerExperienciasActivas(aspiranteId));
    }

    // ===== READ ordenadas por fecha - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{aspiranteId}/ordenadas")
    public ResponseEntity<List<Experiencia>> obtenerExperienciasOrdenadasPorFecha(@PathVariable Long aspiranteId) {
        return ResponseEntity.ok(experienciaService.obtenerExperienciasOrdenadasPorFecha(aspiranteId));
    }

    // ===== READ todas - ADMIN solamente =====
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Experiencia>> listarTodas() {
        return ResponseEntity.ok(experienciaService.listarTodas());
    }

    // ===== READ experiencias del aspirante autenticado =====
    @PreAuthorize("hasRole('ASPIRANTE')")
    @GetMapping("/aspirante")
    public ResponseEntity<?> obtenerMisExperiencias(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long aspiranteId = userDetails.getUsuarioId();
            List<Experiencia> experiencias = experienciaService.obtenerExperienciasPorUsuario(aspiranteId);
            return ResponseEntity.ok(experiencias);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener experiencias: " + e.getMessage()));
        }
    }

    // ===== UPDATE - Solo ASPIRANTE sus propias experiencias o ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarExperiencia(@PathVariable Long id, @RequestBody Experiencia experiencia, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long aspiranteIdActual = userDetails.getUsuarioId();
            Experiencia experienciaExistente = experienciaService.obtenerPorId(id);
            
            // Validar ownership
            if (!experienciaExistente.getAspirante().getId().equals(aspiranteIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes editar experiencias de otro usuario"));
            }
            
            return ResponseEntity.ok(experienciaService.actualizarExperiencia(id, experiencia, aspiranteIdActual));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar experiencia: " + e.getMessage()));
        }
    }

    // ===== PATCH cambiar estado - Solo ASPIRANTE sus propias experiencias o ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam Experiencia.Estado estado, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long aspiranteIdActual = userDetails.getUsuarioId();
            Experiencia experiencia = experienciaService.obtenerPorId(id);
            
            // Validar ownership
            if (!experiencia.getAspirante().getId().equals(aspiranteIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes cambiar estado de experiencias de otro usuario"));
            }
            
            return ResponseEntity.ok(experienciaService.cambiarEstado(id, estado, aspiranteIdActual));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al cambiar estado: " + e.getMessage()));
        }
    }

    // ===== DELETE - Solo ASPIRANTE sus propias experiencias o ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarExperiencia(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long aspiranteIdActual = userDetails.getUsuarioId();
            Experiencia experiencia = experienciaService.obtenerPorId(id);
            
            // Validar ownership
            if (!experiencia.getAspirante().getId().equals(aspiranteIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes eliminar experiencias de otro usuario"));
            }
            
            experienciaService.eliminarExperiencia(id, aspiranteIdActual);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar experiencia: " + e.getMessage()));
        }
    }
}