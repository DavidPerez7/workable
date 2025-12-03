package com.workable_sb.workable.controller;
import com.workable_sb.workable.models.Notificacion;
import com.workable_sb.workable.service.NotificacionService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/notificacion")

public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    // CREATE
    @PostMapping
    public ResponseEntity<Notificacion> create(@Valid @RequestBody Notificacion request) {
        return ResponseEntity.ok(notificacionService.create(request)); 
    }

    // READ
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Notificacion>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(notificacionService.getById(id));
    }

    @GetMapping("/titulo/{titulo}")
    public ResponseEntity<Optional<Notificacion>> getByTitulo(@PathVariable String titulo) {
        return ResponseEntity.ok(notificacionService.getByTitulo(titulo));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Notificacion>> getByUsuarioId(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.getByUsuario(usuarioId));
    }
    
    @GetMapping("/usuario-leida/{usuarioId}")
    public ResponseEntity<List<Notificacion>> getByUsuarioLeida(@PathVariable Long usuarioId, @RequestParam Boolean leida) {
        return ResponseEntity.ok(notificacionService.getByUsuarioAndLeida(usuarioId, leida));
    }
    
    @GetMapping("/usuario-tipo/{usuarioId}")
    public ResponseEntity<List<Notificacion>> getByUsuarioTipo(@PathVariable Long usuarioId, @RequestParam Notificacion.Tipo tipo) {
        return ResponseEntity.ok(notificacionService.getByUsuarioAndTipo(usuarioId, tipo));
    }

    @GetMapping("/usuario-fecha-desc/{usuarioId}")
    public ResponseEntity<List<Notificacion>> getByUsuarioOrderByFechaDesc(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.getByUsuarioOrderByFechaDesc(usuarioId));
    }
    

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Notificacion> update(@PathVariable Long id, @Valid @RequestBody Notificacion request) {
        return ResponseEntity.ok(notificacionService.update(id, request));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        notificacionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
