
package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Estudio;
import com.workable_sb.workable.service.EstudioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estudio")
public class EstudioController {

    @Autowired
    private EstudioService estudioService;

    // - CREATE
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @PostMapping
    public ResponseEntity<Estudio> crearEstudio(@RequestBody Estudio estudio) {
        Long usuarioId = estudio.getUsuario().getId();
        return ResponseEntity.ok(estudioService.crearEstudio(estudio, usuarioId));
    }

    // - READ by id
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Estudio> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(estudioService.obtenerPorId(id));
    }

    // - READ por usuario
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Estudio>> obtenerEstudiosPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(estudioService.obtenerEstudiosPorUsuario(usuarioId));
    }

    // - READ en curso por usuario
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}/encurso")
    public ResponseEntity<List<Estudio>> obtenerEstudiosEnCurso(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(estudioService.obtenerEstudiosEnCurso(usuarioId));
    }

    // - READ por nivel educativo
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}/nivel")
    public ResponseEntity<List<Estudio>> obtenerEstudiosPorNivel(@PathVariable Long usuarioId, @RequestParam Estudio.NivelEducativo nivel) {
        return ResponseEntity.ok(estudioService.obtenerEstudiosPorNivel(usuarioId, nivel));
    }

    // - READ todos (ADMIN solamente)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Estudio>> listarTodos() {
        return ResponseEntity.ok(estudioService.listarTodos());
    }

    // - UPDATE
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Estudio> actualizarEstudio(@PathVariable Long id, @RequestBody Estudio estudio, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(estudioService.actualizarEstudio(id, estudio, usuarioIdActual));
    }

    // - DELETE (ADMIN y RECLUTADOR pueden eliminar, ASPIRANTE solo lo suyo)
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEstudio(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        estudioService.eliminarEstudio(id, usuarioIdActual);
        return ResponseEntity.noContent().build();
    }
}
