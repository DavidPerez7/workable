package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Notificacion;
import com.workable_sb.workable.service.NotificacionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificacion")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    // - CREATE
    @PostMapping
    public ResponseEntity<Notificacion> create(@RequestBody Notificacion request, @RequestParam Long usuarioDestinoId) {
        return ResponseEntity.ok(notificacionService.create(request, usuarioDestinoId));
    }

    // - READ by id
    @GetMapping("/{id}")
    public ResponseEntity<Notificacion> getById(@PathVariable Long id) {
        return ResponseEntity.ok(notificacionService.getById(id));
    }

    // - READ by usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Notificacion>> getByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.getByUsuario(usuarioId));
    }

    // - READ by usuario and leida
    @GetMapping("/usuario-leida/{usuarioId}")
    public ResponseEntity<List<Notificacion>> getByUsuarioAndLeida(@PathVariable Long usuarioId, @RequestParam Boolean leida) {
        return ResponseEntity.ok(notificacionService.getByUsuarioAndLeida(usuarioId, leida));
    }

    // - READ by usuario and tipo
    @GetMapping("/usuario-tipo/{usuarioId}")
    public ResponseEntity<List<Notificacion>> getByUsuarioAndTipo(@PathVariable Long usuarioId, @RequestParam Notificacion.Tipo tipo) {
        return ResponseEntity.ok(notificacionService.getByUsuarioAndTipo(usuarioId, tipo));
    }

    // - READ by usuario order by fecha desc
    @GetMapping("/usuario-fecha-desc/{usuarioId}")
    public ResponseEntity<List<Notificacion>> getByUsuarioOrderByFechaDesc(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.getByUsuarioOrderByFechaDesc(usuarioId));
    }

    // - READ activas by usuario
    @GetMapping("/usuario/{usuarioId}/activas")
    public ResponseEntity<List<Notificacion>> getActivasByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.getActivasByUsuario(usuarioId));
    }

    // - READ contar no leidas
    @GetMapping("/usuario/{usuarioId}/no-leidas")
    public ResponseEntity<Long> contarNoLeidas(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.contarNoLeidas(usuarioId));
    }

    // - UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Notificacion> update(@PathVariable Long id, @RequestBody Notificacion request) {
        return ResponseEntity.ok(notificacionService.update(id, request));
    }

    // - PATCH marcar como leida
    @PatchMapping("/{id}/leida")
    public ResponseEntity<Notificacion> marcarComoLeida(@PathVariable Long id) {
        return ResponseEntity.ok(notificacionService.marcarComoLeida(id));
    }

    // - PATCH marcar todas como leidas
    @PatchMapping("/usuario/{usuarioId}/leidas")
    public ResponseEntity<Void> marcarTodasComoLeidas(@PathVariable Long usuarioId) {
        notificacionService.marcarTodasComoLeidas(usuarioId);
        return ResponseEntity.noContent().build();
    }

    // - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        notificacionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
