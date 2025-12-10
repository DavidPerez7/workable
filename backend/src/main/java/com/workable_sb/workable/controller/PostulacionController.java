package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.models.Postulacion.Estado;
import com.workable_sb.workable.service.PostulacionService;
import com.workable_sb.workable.security.CustomUserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/postulacion")
public class PostulacionController {

    @Autowired
    private PostulacionService postulacionService;

    // CREATE - Solo ASPIRANTE puede postularse a ofertas, pero ADMIN puede crear para testing
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> request, @AuthenticationPrincipal CustomUserDetails user) {
        try {
            Long usuarioId = user.getUsuarioId();
            Long ofertaId = Long.parseLong(request.get("ofertaId").toString());
            Postulacion postulacion = postulacionService.crearPostulacion(usuarioId, ofertaId, usuarioId);
            return ResponseEntity.ok(postulacion);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear postulación: " + e.getMessage()));
        }
    }

    // READ by id
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        try {
            Postulacion postulacion = postulacionService.obtenerPorId(id, usuarioIdActual);
            return ResponseEntity.ok(postulacion);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener postulación: " + e.getMessage()));
        }
    }

    // READ by oferta (solo RECLUTADOR y ADMIN)
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/oferta/{ofertaId}")
    public ResponseEntity<?> getByOferta(@PathVariable Long ofertaId, @RequestParam Long usuarioIdActual) {
        try {
            List<Postulacion> postulaciones = postulacionService.listarPorOferta(ofertaId, usuarioIdActual);
            return ResponseEntity.ok(postulaciones);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener postulaciones: " + e.getMessage()));
        }
    }

    // READ by usuario (aspirante puede ver sus postulaciones, reclutador/admin las de otros)
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> getByAspirante(@PathVariable Long usuarioId, @RequestParam Long usuarioIdActual) {
        try {
            List<Postulacion> postulaciones = postulacionService.listarPorAspirante(usuarioId, usuarioIdActual);
            return ResponseEntity.ok(postulaciones);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener postulaciones: " + e.getMessage()));
        }
    }

    // READ by oferta y estado (solo RECLUTADOR y ADMIN)
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/oferta/{ofertaId}/estado")
    public ResponseEntity<?> getByOfertaYEstado(@PathVariable Long ofertaId, @RequestParam Estado estado, @RequestParam Long usuarioIdActual) {
        try {
            List<Postulacion> postulaciones = postulacionService.listarPorOfertaYEstado(ofertaId, estado, usuarioIdActual);
            return ResponseEntity.ok(postulaciones);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener postulaciones: " + e.getMessage()));
        }
    }

    // READ by usuario y estado
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}/estado")
    public ResponseEntity<?> getByUsuarioYEstado(@PathVariable Long usuarioId, @RequestParam Estado estado, @RequestParam Long usuarioIdActual) {
        try {
            List<Postulacion> postulaciones = postulacionService.listarPorAspiranteYEstado(usuarioId, estado, usuarioIdActual);
            return ResponseEntity.ok(postulaciones);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener postulaciones: " + e.getMessage()));
        }
    }

    // READ verificar si ya se postuló
    @GetMapping("/verificar")
    public ResponseEntity<?> yaSePostulo(@RequestParam Long usuarioId, @RequestParam Long ofertaId) {
        try {
            boolean yaSePostulo = postulacionService.yaSePostulo(usuarioId, ofertaId);
            return ResponseEntity.ok(Map.of("yaSePostulo", yaSePostulo));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al verificar postulación: " + e.getMessage()));
        }
    }

    // UPDATE cambiar estado (solo RECLUTADOR y ADMIN)
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam Estado nuevoEstado, @RequestParam Long usuarioIdActual) {
        try {
            Postulacion postulacion = postulacionService.cambiarEstado(id, nuevoEstado, usuarioIdActual);
            return ResponseEntity.ok(postulacion);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al cambiar estado: " + e.getMessage()));
        }
    }

    // DELETE (soft delete) - Aspirante puede retirar su postulación, Reclutador puede eliminarla
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        try {
            postulacionService.eliminarPostulacion(id, usuarioIdActual);
            return ResponseEntity.ok(Map.of("message", "Postulación eliminada correctamente"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar postulación: " + e.getMessage()));
        }
    }

    // DELETE alternativo - Usa el usuario autenticado del JWT
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @DeleteMapping("/{id}/eliminar")
    public ResponseEntity<?> deleteWithAuth(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails user) {
        try {
            Long usuarioId = user.getUsuarioId();
            postulacionService.eliminarPostulacion(id, usuarioId);
            return ResponseEntity.ok(Map.of("message", "Postulación eliminada correctamente"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar postulación: " + e.getMessage()));
        }
    }

    // Endpoint adicional: Listar todas las postulaciones del aspirante actual
    @PreAuthorize("hasRole('ASPIRANTE')")
    @GetMapping("/mis-postulaciones")
    public ResponseEntity<?> miasPostulaciones(@RequestParam Long usuarioId) {
        try {
            List<Postulacion> postulaciones = postulacionService.listarPorAspirante(usuarioId, usuarioId);
            return ResponseEntity.ok(postulaciones);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener postulaciones: " + e.getMessage()));
        }
    }

    // Endpoint: Obtener postulaciones del aspirante autenticado
    @PreAuthorize("hasRole('ASPIRANTE')")
    @GetMapping("/aspirante")
    public ResponseEntity<?> obtenerPostulacionesAspirante(@AuthenticationPrincipal CustomUserDetails user) {
        try {
            Long usuarioId = user.getUsuarioId();
            List<Postulacion> postulaciones = postulacionService.listarPorAspirante(usuarioId, usuarioId);
            return ResponseEntity.ok(postulaciones);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener postulaciones: " + e.getMessage()));
        }
    }

    // Endpoint: Ver estado de una postulación específica
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}/estado")
    public ResponseEntity<?> obtenerEstado(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        try {
            Postulacion postulacion = postulacionService.obtenerPorId(id, usuarioIdActual);
            return ResponseEntity.ok(Map.of("estado", postulacion.getEstado(), "postulacionId", postulacion.getId()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener estado: " + e.getMessage()));
        }
    }

    // ===== ENDPOINTS PARA VER ASPIRANTES CON DETALLE (RECLUTADOR) =====

    // Ver todos los aspirantes de una vacante
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/oferta/{ofertaId}/aspirantes")
    public ResponseEntity<?> verAspirantes(@PathVariable Long ofertaId, @RequestParam Long usuarioIdActual) {
        try {
            List<Map<String, Object>> aspirantes = postulacionService.obtenerTodosLosAspirantes(ofertaId, usuarioIdActual);
            return ResponseEntity.ok(aspirantes);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener aspirantes: " + e.getMessage()));
        }
    }

    // Ver aspirantes filtrados por estado
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/oferta/{ofertaId}/aspirantes/filtro")
    public ResponseEntity<?> verAspirantesPorEstado(@PathVariable Long ofertaId, @RequestParam(required = false) String estado, @RequestParam Long usuarioIdActual) {
        try {
            List<Map<String, Object>> aspirantes = postulacionService.obtenerAspirantes(ofertaId, usuarioIdActual, estado);
            return ResponseEntity.ok(aspirantes);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener aspirantes: " + e.getMessage()));
        }
    }

    // Ver perfil completo de un aspirante para una postulación
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/{postulacionId}/aspirante-detalle")
    public ResponseEntity<?> verDetalleAspirante(@PathVariable Long postulacionId, @RequestParam Long usuarioIdActual) {
        try {
            Map<String, Object> detalles = postulacionService.obtenerDetalleAspirante(postulacionId, usuarioIdActual);
            return ResponseEntity.ok(detalles);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener detalles del aspirante: " + e.getMessage()));
        }
    }
}
