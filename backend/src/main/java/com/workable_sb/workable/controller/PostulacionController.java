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

    // GET ALL (ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<?> getAllPostulaciones() {
        try {
            List<Postulacion> postulaciones = postulacionService.getAll();
            return ResponseEntity.ok(postulaciones);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener postulaciones: " + e.getMessage()));
        }
    }

    // CREATE
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Postulacion request, @AuthenticationPrincipal CustomUserDetails user) {
        try {
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
            }
            
            if (request == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Cuerpo de la petición inválido"));
            }
            if (request.getAspirante() == null || request.getAspirante().getId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "aspiranteId es obligatorio"));
            }
            if (request.getOferta() == null || request.getOferta().getId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "ofertaId es obligatorio"));
            }

            Long aspiranteId = request.getAspirante().getId();
            Long ofertaId = request.getOferta().getId();
            Postulacion creada = postulacionService.create(request);
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
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Postulacion postulacion = postulacionService.getById(id);
            return ResponseEntity.ok(postulacion);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener postulación: " + e.getMessage()));
        }
    }

    // GET BY OFERTA
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/oferta/{ofertaId}")
    public ResponseEntity<?> getByOferta(@PathVariable Long ofertaId) {
        try {
            List<Postulacion> postulaciones = postulacionService.getByOfertaId(ofertaId);
            return ResponseEntity.ok(postulaciones);
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
            List<Postulacion> postulaciones = postulacionService.getByAspiranteId(user.getUsuarioId());
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
            Postulacion actualizada = postulacionService.update(id, postulacion);
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
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            postulacionService.delete(id);
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
