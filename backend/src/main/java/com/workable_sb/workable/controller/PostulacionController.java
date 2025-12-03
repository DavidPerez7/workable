package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.models.Postulacion.Estado;
import com.workable_sb.workable.service.PostulacionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/postulacion")
public class PostulacionController {

    @Autowired
    private PostulacionService postulacionService;

    // CREATE
    @PostMapping
    public ResponseEntity<Postulacion> create(@RequestParam Long usuarioId, @RequestParam Long ofertaId) {
        return ResponseEntity.ok(postulacionService.crearPostulacion(usuarioId, ofertaId));
    }

    // READ by id
    @GetMapping("/{id}")
    public ResponseEntity<Postulacion> getById(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(postulacionService.obtenerPorId(id, usuarioIdActual));
    }

    // READ by oferta
    @GetMapping("/oferta/{ofertaId}")
    public ResponseEntity<List<Postulacion>> getByOferta(@PathVariable Long ofertaId, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(postulacionService.listarPorOferta(ofertaId, usuarioIdActual));
    }

    // READ by usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Postulacion>> getByUsuario(@PathVariable Long usuarioId, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(postulacionService.listarPorUsuario(usuarioId, usuarioIdActual));
    }

    // READ by oferta y estado
    @GetMapping("/oferta/{ofertaId}/estado")
    public ResponseEntity<List<Postulacion>> getByOfertaYEstado(@PathVariable Long ofertaId, @RequestParam Estado estado, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(postulacionService.listarPorOfertaYEstado(ofertaId, estado, usuarioIdActual));
    }

    // READ by usuario y estado
    @GetMapping("/usuario/{usuarioId}/estado")
    public ResponseEntity<List<Postulacion>> getByUsuarioYEstado(@PathVariable Long usuarioId, @RequestParam Estado estado, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(postulacionService.listarPorUsuarioYEstado(usuarioId, estado, usuarioIdActual));
    }

    // READ ya se postuló
    @GetMapping("/verificar")
    public ResponseEntity<Boolean> yaSePostulo(@RequestParam Long usuarioId, @RequestParam Long ofertaId) {
        return ResponseEntity.ok(postulacionService.yaSePostulo(usuarioId, ofertaId));
    }

    // UPDATE cambiar estado
    @PutMapping("/{id}/estado")
    public ResponseEntity<Postulacion> cambiarEstado(@PathVariable Long id, @RequestParam Estado nuevoEstado, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(postulacionService.cambiarEstado(id, nuevoEstado, usuarioIdActual));
    }

    // DELETE (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        postulacionService.eliminarPostulacion(id, usuarioIdActual);
        return ResponseEntity.noContent().build();
    }
}
