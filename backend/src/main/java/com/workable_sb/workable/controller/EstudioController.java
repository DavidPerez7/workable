
package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Estudio;
import com.workable_sb.workable.service.EstudioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estudio")
public class EstudioController {

    @Autowired
    private EstudioService estudioService;

    // - CREATE
    @PostMapping
    public ResponseEntity<Estudio> crearEstudio(@RequestBody Estudio estudio, @RequestParam Long usuarioId) {
        return ResponseEntity.ok(estudioService.crearEstudio(estudio, usuarioId));
    }

    // - READ by id
    @GetMapping("/{id}")
    public ResponseEntity<Estudio> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(estudioService.obtenerPorId(id));
    }

    // - READ por usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Estudio>> obtenerEstudiosPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(estudioService.obtenerEstudiosPorUsuario(usuarioId));
    }

    // - READ en curso por usuario
    @GetMapping("/usuario/{usuarioId}/encurso")
    public ResponseEntity<List<Estudio>> obtenerEstudiosEnCurso(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(estudioService.obtenerEstudiosEnCurso(usuarioId));
    }

    // - READ por nivel educativo
    @GetMapping("/usuario/{usuarioId}/nivel")
    public ResponseEntity<List<Estudio>> obtenerEstudiosPorNivel(@PathVariable Long usuarioId, @RequestParam Estudio.NivelEducativo nivel) {
        return ResponseEntity.ok(estudioService.obtenerEstudiosPorNivel(usuarioId, nivel));
    }

    // - READ todos
    @GetMapping
    public ResponseEntity<List<Estudio>> listarTodos() {
        return ResponseEntity.ok(estudioService.listarTodos());
    }

    // - UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Estudio> actualizarEstudio(@PathVariable Long id, @RequestBody Estudio estudio, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(estudioService.actualizarEstudio(id, estudio, usuarioIdActual));
    }

    // - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEstudio(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        estudioService.eliminarEstudio(id, usuarioIdActual);
        return ResponseEntity.noContent().build();
    }
}
