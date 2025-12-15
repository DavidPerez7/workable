package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.models.Postulacion.Estado;
import com.workable_sb.workable.service.PostulacionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(PostulacionController.class);

    @Autowired
    private PostulacionService postulacionService;

    // CREATE
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Postulacion postulacion, @AuthenticationPrincipal CustomUserDetails user) {
        try {
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
            }
            Long usuarioId = user.getUsuarioId();
            log.info("Creando postulación: usuarioId={}, postulacion.aspirante.id={}, postulacion.oferta.id={}",
                usuarioId, postulacion.getAspirante() != null ? postulacion.getAspirante().getId() : null,
                postulacion.getOferta() != null ? postulacion.getOferta().getId() : null);
            log.info("Crear postulacion request body: {}", postulacion);
            // Validaciones claras para evitar NullPointer y mensajes crípticos desde capas inferiores
            if (postulacion == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Cuerpo de la petición inválido"));
            }
            if (postulacion.getAspirante() == null || postulacion.getAspirante().getId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "aspirante.id es obligatorio"));
            }
            if (postulacion.getOferta() == null || postulacion.getOferta().getId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "oferta.id es obligatorio"));
            }

            Long aspiranteId = postulacion.getAspirante().getId();
            Long ofertaId = postulacion.getOferta().getId();
            Postulacion creada = postulacionService.crearPostulacion(aspiranteId, ofertaId, usuarioId);
            return ResponseEntity.ok(creada);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear postulación: " + e.getMessage()));
        }
    }

    // GET BY ID
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails user) {
        try {
            Postulacion postulacion = postulacionService.obtenerPorId(id, user.getUsuarioId());
            return ResponseEntity.ok(postulacion);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener postulación: " + e.getMessage()));
        }
    }

    // GET BY OFERTA
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/oferta/{ofertaId}")
    public ResponseEntity<?> getByOferta(@PathVariable Long ofertaId, @AuthenticationPrincipal CustomUserDetails user) {
        try {
            List<Postulacion> postulaciones = postulacionService.listarPorOferta(ofertaId, user.getUsuarioId());
            return ResponseEntity.ok(postulaciones);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener postulaciones: " + e.getMessage()));
        }
    }

    // GET BY ASPIRANTE
    @PreAuthorize("hasRole('ASPIRANTE')")
    @GetMapping("/aspirante")
    public ResponseEntity<?> getByAspirante(@AuthenticationPrincipal CustomUserDetails user) {
        try {
            List<Postulacion> postulaciones = postulacionService.listarPorAspirante(user.getUsuarioId(), user.getUsuarioId());
            return ResponseEntity.ok(postulaciones);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener postulaciones: " + e.getMessage()));
        }
    }

    // UPDATE
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestBody Postulacion postulacion) {
        try {
            postulacion.setId(id);
            Postulacion actualizada = postulacionService.cambiarEstado(postulacion);
            return ResponseEntity.ok(actualizada);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al cambiar estado: " + e.getMessage()));
        }
    }

    // DELETE
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
}
