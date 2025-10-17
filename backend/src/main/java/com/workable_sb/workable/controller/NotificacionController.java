package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.NotificacionDto;
import com.workable_sb.workable.service.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {
    @Autowired
    private NotificacionService notificacionService;

    @PostMapping
    public NotificacionDto crearNotificacion(@RequestBody NotificacionDto notificacionDto) {
        return notificacionService.crearNotificacion(notificacionDto);
    }

    @GetMapping("/{id}")
    public NotificacionDto obtenerNotificacionPorId(@PathVariable Integer id) {
        return notificacionService.obtenerNotificacionPorId(id);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<NotificacionDto> listarNotificacionesPorUsuario(@PathVariable Integer usuarioId) {
        return notificacionService.listarNotificacionesPorUsuario(usuarioId);
    }

    @PutMapping("/leida/{id}")
    public NotificacionDto marcarComoLeida(@PathVariable Integer id) {
        return notificacionService.marcarComoLeida(id);
    }

    @DeleteMapping("/{id}")
    public void eliminarNotificacion(@PathVariable Integer id) {
        notificacionService.eliminarNotificacion(id);
    }
}
