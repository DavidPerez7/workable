
package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.service.ExperienciaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiencia")
public class ExperienciaController {

    @Autowired
    private ExperienciaService experienciaService;

    // - CREATE
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @PostMapping
    public ResponseEntity<Experiencia> crearExperiencia(@RequestBody Experiencia experiencia, @RequestParam Long usuarioId) {
        return ResponseEntity.ok(experienciaService.crearExperiencia(experiencia, usuarioId));
    }

    // - READ by id
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Experiencia> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(experienciaService.obtenerPorId(id));
    }

    // - READ por usuario
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Experiencia>> obtenerExperienciasPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(experienciaService.obtenerExperienciasPorUsuario(usuarioId));
    }

    // - READ activas por usuario
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}/activas")
    public ResponseEntity<List<Experiencia>> obtenerExperienciasActivas(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(experienciaService.obtenerExperienciasActivas(usuarioId));
    }

    // - READ ordenadas por fecha
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}/ordenadas")
    public ResponseEntity<List<Experiencia>> obtenerExperienciasOrdenadasPorFecha(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(experienciaService.obtenerExperienciasOrdenadasPorFecha(usuarioId));
    }

    // - READ todas (ADMIN solamente)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Experiencia>> listarTodas() {
        return ResponseEntity.ok(experienciaService.listarTodas());
    }

    // - UPDATE
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Experiencia> actualizarExperiencia(@PathVariable Long id, @RequestBody Experiencia experiencia, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(experienciaService.actualizarExperiencia(id, experiencia, usuarioIdActual));
    }

    // - PATCH cambiar estado
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Experiencia> cambiarEstado(@PathVariable Long id, @RequestParam Experiencia.Estado estado, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(experienciaService.cambiarEstado(id, estado, usuarioIdActual));
    }

    // - DELETE (ADMIN y RECLUTADOR pueden eliminar, ASPIRANTE solo lo suyo)
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarExperiencia(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        experienciaService.eliminarExperiencia(id, usuarioIdActual);
        return ResponseEntity.noContent().build();
    }
}
