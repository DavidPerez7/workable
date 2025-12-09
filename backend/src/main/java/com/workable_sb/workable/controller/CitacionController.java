package com.workable_sb.workable.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.workable_sb.workable.models.Citacion;
import com.workable_sb.workable.service.CitacionService;

@RestController
@RequestMapping("/api/citacion")
public class CitacionController {
    
    @Autowired
    private CitacionService citacionService;
    
    // ===== CREATE =====
    
    // Crear una citación individual
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PostMapping
    public ResponseEntity<?> crearCitacion(
            @RequestParam Long postulacionId,
            @RequestParam Long reclutadorId,
            @RequestParam LocalDate fechaCitacion,
            @RequestParam String hora,
            @RequestParam String linkMeet,
            @RequestParam(required = false) String detalles,
            @RequestParam Long usuarioIdActual) {
        try {
            Citacion citacion = citacionService.crearCitacion(
                postulacionId, reclutadorId, fechaCitacion, hora, linkMeet, detalles, usuarioIdActual
            );
            return ResponseEntity.ok(Map.of(
                "mensaje", "Citación creada exitosamente",
                "citacionId", citacion.getId(),
                "estado", citacion.getEstado()
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear citación: " + e.getMessage()));
        }
    }
    
    // Crear citaciones múltiples
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PostMapping("/multiples")
    public ResponseEntity<?> crearCitacionesMultiples(
            @RequestParam List<Long> postulacionIds,
            @RequestParam Long reclutadorId,
            @RequestParam LocalDate fechaCitacion,
            @RequestParam String hora,
            @RequestParam String linkMeet,
            @RequestParam(required = false) String detalles,
            @RequestParam Long usuarioIdActual) {
        try {
            Map<String, Object> resultado = citacionService.enviarCitacionesMultiples(
                postulacionIds, reclutadorId, fechaCitacion, hora, linkMeet, detalles, usuarioIdActual
            );
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear citaciones: " + e.getMessage()));
        }
    }
    
    // ===== READ =====
    
    // Obtener todas las citaciones (solo ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> obtenerTodas() {
        try {
            List<Citacion> citaciones = citacionService.obtenerTodas();
            return ResponseEntity.ok(citaciones);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener citaciones: " + e.getMessage()));
        }
    }
    
    // Obtener una citación por ID
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/{citacionId}")
    public ResponseEntity<?> obtenerCitacion(
            @PathVariable Long citacionId,
            @RequestParam Long usuarioIdActual) {
        try {
            Citacion citacion = citacionService.obtenerCitacion(citacionId, usuarioIdActual);
            return ResponseEntity.ok(citacion);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener citación: " + e.getMessage()));
        }
    }
    
    // Obtener citaciones del reclutador
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/reclutador/{reclutadorId}")
    public ResponseEntity<?> obtenerCitacionesDelReclutador(
            @PathVariable Long reclutadorId,
            @RequestParam Long usuarioIdActual) {
        try {
            List<Citacion> citaciones = citacionService.obtenerCitacionesDelReclutador(reclutadorId, usuarioIdActual);
            return ResponseEntity.ok(citaciones);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener citaciones: " + e.getMessage()));
        }
    }
    
    // Obtener citaciones del aspirante
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/aspirante/{usuarioId}")
    public ResponseEntity<?> obtenerCitacionesDelAspirante(
            @PathVariable Long usuarioId,
            @RequestParam Long usuarioIdActual) {
        try {
            List<Citacion> citaciones = citacionService.obtenerCitacionesDelAspirante(usuarioId, usuarioIdActual);
            return ResponseEntity.ok(citaciones);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener citaciones: " + e.getMessage()));
        }
    }
    
    // Obtener citaciones de una oferta
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/oferta/{ofertaId}")
    public ResponseEntity<?> obtenerCitacionesDeOferta(
            @PathVariable Long ofertaId,
            @RequestParam Long usuarioIdActual) {
        try {
            List<Citacion> citaciones = citacionService.obtenerCitacionesDeOferta(ofertaId, usuarioIdActual);
            return ResponseEntity.ok(citaciones);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener citaciones: " + e.getMessage()));
        }
    }
    
    // ===== ENVIAR POR EMAIL =====
    
    // Enviar citación por Email
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PostMapping("/{citacionId}/enviar-email")
    public ResponseEntity<?> enviarCitacionPorEmail(
            @PathVariable Long citacionId,
            @RequestParam Long usuarioIdActual) {
        try {
            Map<String, Object> resultado = citacionService.enviarCitacionPorEmail(citacionId, usuarioIdActual);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al enviar citación por email: " + e.getMessage()));
        }
    }
    
    // ===== UPDATE =====
    
    // Cambiar estado de citación
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PutMapping("/{citacionId}/estado")
    public ResponseEntity<?> cambiarEstado(
            @PathVariable Long citacionId,
            @RequestParam String estado,
            @RequestParam Long usuarioIdActual) {
        try {
            Citacion citacion = citacionService.cambiarEstadoCitacion(citacionId, estado, usuarioIdActual);
            return ResponseEntity.ok(Map.of(
                "mensaje", "Estado actualizado exitosamente",
                "nuevoEstado", citacion.getEstado()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al cambiar estado: " + e.getMessage()));
        }
    }
    
    // ===== DELETE =====
    
    // Eliminar citación (soft delete)
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @DeleteMapping("/{citacionId}")
    public ResponseEntity<?> eliminarCitacion(
            @PathVariable Long citacionId,
            @RequestParam Long usuarioIdActual) {
        try {
            citacionService.eliminarCitacion(citacionId, usuarioIdActual);
            return ResponseEntity.ok(Map.of("mensaje", "Citación eliminada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar citación: " + e.getMessage()));
        }
    }
}
