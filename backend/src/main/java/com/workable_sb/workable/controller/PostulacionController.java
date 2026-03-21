package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.service.PostulacionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/postulacion")
public class PostulacionController {

    @Autowired
    private PostulacionService postulacionService;

    // CREATE
    @PreAuthorize("hasAnyRole('ADMIN', 'ASPIRANTE')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Postulacion postulacion) {
        try {
            Postulacion creada = postulacionService.create(postulacion);
            return ResponseEntity.status(201).body(creada);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear postulación: " + e.getMessage()));
        }
    }

    // READ
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Postulacion> postulaciones = postulacionService.getAll();
            return ResponseEntity.ok(postulaciones);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener postulaciones: " + e.getMessage()));
        }
    }

    // READ BY ID
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

    // GET BY ASPIRANTE
    @PreAuthorize("hasAnyRole('ADMIN', 'ASPIRANTE')")
    @GetMapping("/aspirante/{aspiranteId}")
    public ResponseEntity<?> getByAspiranteId(@PathVariable Long aspiranteId) {
        try {
            return ResponseEntity.ok(postulacionService.getByAspiranteId(aspiranteId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener postulaciones por aspirante: " + e.getMessage()));
        }
    }

    // GET BY OFERTA
    @PreAuthorize("hasAnyRole('ADMIN', 'RECLUTADOR')")
    @GetMapping("/oferta/{ofertaId}")
    public ResponseEntity<?> getByOfertaId(@PathVariable Long ofertaId) {
        try {
            return ResponseEntity.ok(postulacionService.getByOfertaId(ofertaId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener postulaciones por oferta: " + e.getMessage()));
        }
    }

    // UPDATE
    @PreAuthorize("hasAnyRole('ADMIN', 'RECLUTADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Postulacion postulacion) {
        try {
            postulacion.setId(id);
            Postulacion actualizada = postulacionService.update(id, postulacion);
            return ResponseEntity.ok(actualizada);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar postulación: " + e.getMessage()));
        }
    }

    // DELETE
    @PreAuthorize("hasAnyRole('ADMIN', 'ASPIRANTE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            postulacionService.delete(id);
            return ResponseEntity.status(204).build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar postulación: " + e.getMessage()));
        }
    }
}
