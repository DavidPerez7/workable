


package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.service.ExperienciaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> crearExperiencia(@RequestBody Experiencia experiencia, @RequestParam Long usuarioId, @RequestParam Long usuarioIdActual) {
        try {
            // Validar que el usuario solo puede crear experiencias para sí mismo
            if (!usuarioId.equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes crear experiencias para otro usuario"));
            }
            return ResponseEntity.ok(experienciaService.crearExperiencia(experiencia, usuarioId));
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
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Experiencia>> obtenerExperienciasPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(experienciaService.obtenerExperienciasPorUsuario(usuarioId));
    }

    // ===== READ activas por usuario - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}/activas")
    public ResponseEntity<List<Experiencia>> obtenerExperienciasActivas(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(experienciaService.obtenerExperienciasActivas(usuarioId));
    }

    // ===== READ ordenadas por fecha - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}/ordenadas")
    public ResponseEntity<List<Experiencia>> obtenerExperienciasOrdenadasPorFecha(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(experienciaService.obtenerExperienciasOrdenadasPorFecha(usuarioId));
    }

    // ===== READ todas - ADMIN solamente =====
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Experiencia>> listarTodas() {
        return ResponseEntity.ok(experienciaService.listarTodas());
    }

    // ===== UPDATE - Solo ASPIRANTE sus propias experiencias o ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarExperiencia(@PathVariable Long id, @RequestBody Experiencia experiencia, @RequestParam Long usuarioIdActual) {
        try {
            Experiencia experienciaExistente = experienciaService.obtenerPorId(id);
            
            // Validar ownership
            if (!experienciaExistente.getUsuario().getId().equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes editar experiencias de otro usuario"));
            }
            
            return ResponseEntity.ok(experienciaService.actualizarExperiencia(id, experiencia, usuarioIdActual));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar experiencia: " + e.getMessage()));
        }
    }

    // ===== PATCH cambiar estado - Solo ASPIRANTE sus propias experiencias o ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam Experiencia.Estado estado, @RequestParam Long usuarioIdActual) {
        try {
            Experiencia experiencia = experienciaService.obtenerPorId(id);
            
            // Validar ownership
            if (!experiencia.getUsuario().getId().equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes cambiar estado de experiencias de otro usuario"));
            }
            
            return ResponseEntity.ok(experienciaService.cambiarEstado(id, estado, usuarioIdActual));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al cambiar estado: " + e.getMessage()));
        }
    }

    // ===== DELETE - Solo ASPIRANTE sus propias experiencias o ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarExperiencia(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        try {
            Experiencia experiencia = experienciaService.obtenerPorId(id);
            
            // Validar ownership
            if (!experiencia.getUsuario().getId().equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes eliminar experiencias de otro usuario"));
            }
            
            experienciaService.eliminarExperiencia(id, usuarioIdActual);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar experiencia: " + e.getMessage()));
        }
    }
}