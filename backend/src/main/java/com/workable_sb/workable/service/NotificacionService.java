package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.NotificacionDto;
import java.util.List;

public interface NotificacionService {
    NotificacionDto crearNotificacion(NotificacionDto notificacionDto);
    NotificacionDto obtenerNotificacionPorId(Integer id);
    List<NotificacionDto> listarNotificacionesPorUsuario(Integer usuarioId);
    NotificacionDto marcarComoLeida(Integer id);
    void eliminarNotificacion(Integer id);
}
