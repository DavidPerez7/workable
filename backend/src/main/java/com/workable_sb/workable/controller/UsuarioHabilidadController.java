package com.workable_sb.workable.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.workable_sb.workable.models.UsuarioHabilidad;
import com.workable_sb.workable.models.UsuarioHabilidad.NivelDominio;
import com.workable_sb.workable.service.UsuarioHabilidadService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controlador REST para gestionar las habilidades de los usuarios.
 * Permite a los aspirantes agregar, actualizar y eliminar sus habilidades.
 */
@RestController
@RequestMapping("/api/usuario-habilidad")
public class UsuarioHabilidadController {

    private static final Logger log = LoggerFactory.getLogger(UsuarioHabilidadController.class);

    @Autowired
    private UsuarioHabilidadService usuarioHabilidadService;

    // ===== CREATE =====
    /**
     * Agrega una habilidad a un usuario.
     * El aspirante solo puede agregar habilidades a su propio perfil.
     */
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PostMapping
    public ResponseEntity<?> agregarHabilidad(
            @RequestParam Long usuarioId,
            @RequestParam Long habilidadId,
            @RequestParam NivelDominio nivel,
            @RequestParam Long usuarioActualId) {
        try {
            log.info("Agregando habilidad {} al usuario {} con nivel {}", habilidadId, usuarioId, nivel);
            UsuarioHabilidad usuarioHabilidad = usuarioHabilidadService.agregarHabilidad(usuarioId, habilidadId, nivel, usuarioActualId);
            return ResponseEntity.ok(usuarioHabilidad);
        } catch (IllegalArgumentException e) {
            log.warn("Error de validación al agregar habilidad: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            log.error("Error al agregar habilidad: {}", e.getMessage());
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error inesperado al agregar habilidad", e);
            return ResponseEntity.status(500).body(Map.of("error", "Error al agregar habilidad: " + e.getMessage()));
        }
    }

    // ===== READ =====
    /**
     * Obtiene una UsuarioHabilidad por su ID.
     */
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            UsuarioHabilidad usuarioHabilidad = usuarioHabilidadService.obtenerPorId(id);
            return ResponseEntity.ok(usuarioHabilidad);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener habilidad: " + e.getMessage()));
        }
    }

    /**
     * Lista todas las habilidades de un usuario.
     */
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> listarPorUsuario(@PathVariable Long usuarioId) {
        try {
            log.info("Listando habilidades del usuario {}", usuarioId);
            List<UsuarioHabilidad> habilidades = usuarioHabilidadService.listarPorUsuario(usuarioId);
            return ResponseEntity.ok(habilidades);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al listar habilidades: " + e.getMessage()));
        }
    }

    /**
     * Lista las habilidades de un usuario por nivel de dominio.
     */
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}/nivel/{nivel}")
    public ResponseEntity<?> listarPorUsuarioYNivel(@PathVariable Long usuarioId, @PathVariable NivelDominio nivel) {
        try {
            List<UsuarioHabilidad> habilidades = usuarioHabilidadService.listarPorUsuarioYNivel(usuarioId, nivel);
            return ResponseEntity.ok(habilidades);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al listar habilidades: " + e.getMessage()));
        }
    }

    // ===== UPDATE =====
    /**
     * Actualiza el nivel de dominio de una habilidad.
     */
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PutMapping("/{id}/nivel")
    public ResponseEntity<?> actualizarNivel(
            @PathVariable Long id,
            @RequestParam NivelDominio nuevoNivel,
            @RequestParam Long usuarioActualId) {
        try {
            log.info("Actualizando nivel de habilidad {} a {}", id, nuevoNivel);
            UsuarioHabilidad actualizada = usuarioHabilidadService.actualizarNivel(id, nuevoNivel, usuarioActualId);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar nivel: " + e.getMessage()));
        }
    }

    /**
     * Actualiza la fecha de adquisición de una habilidad.
     */
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PutMapping("/{id}/fecha-adquisicion")
    public ResponseEntity<?> actualizarFechaAdquisicion(
            @PathVariable Long id,
            @RequestParam LocalDate nuevaFecha,
            @RequestParam Long usuarioActualId) {
        try {
            UsuarioHabilidad actualizada = usuarioHabilidadService.actualizarFechaAdquisicion(id, nuevaFecha, usuarioActualId);
            return ResponseEntity.ok(actualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar fecha: " + e.getMessage()));
        }
    }

    // ===== DELETE =====
    /**
     * Elimina una habilidad del usuario.
     */
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarHabilidad(@PathVariable Long id, @RequestParam Long usuarioActualId) {
        try {
            log.info("Eliminando habilidad {} por usuario {}", id, usuarioActualId);
            usuarioHabilidadService.eliminarHabilidad(id, usuarioActualId);
            return ResponseEntity.ok(Map.of("message", "Habilidad eliminada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar habilidad: " + e.getMessage()));
        }
    }
}
