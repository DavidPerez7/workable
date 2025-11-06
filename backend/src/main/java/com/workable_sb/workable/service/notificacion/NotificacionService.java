package com.workable_sb.workable.service.notificacion;

import java.util.List;

import com.workable_sb.workable.dto.notificacion.NotificacionDto;

public interface NotificacionService {
    NotificacionDto crearNotificacion(NotificacionDto notificacionDto);
    NotificacionDto obtenerNotificacionPorId(Integer id);
    List<NotificacionDto> listarNotificacionesPorUsuario(Integer usuarioId);
    NotificacionDto marcarComoLeida(Integer id);
    void eliminarNotificacion(Integer id);
}
