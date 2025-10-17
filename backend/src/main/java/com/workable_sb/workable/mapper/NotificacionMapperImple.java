package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;
import com.workable_sb.workable.dto.NotificacionDto;
import com.workable_sb.workable.models.Notificacion;
import com.workable_sb.workable.models.Usuario;

@Component
public class NotificacionMapperImple implements NotificacionMapper {
    @Override
    public NotificacionDto toDto(Notificacion notificacion) {
        if (notificacion == null) return null;
        NotificacionDto dto = new NotificacionDto();
        dto.setNotificacionId(notificacion.getNotificacionId());
        dto.setMensaje(notificacion.getMensaje());
        dto.setFecha(notificacion.getFecha());
        dto.setLeida(notificacion.getLeida());
        if (notificacion.getUsuario() != null) {
            dto.setUsuarioId(notificacion.getUsuario().getUsuarioId());
        }
        return dto;
    }

    @Override
    public Notificacion toEntity(NotificacionDto notificacionDto) {
        if (notificacionDto == null) return null;
        Notificacion notificacion = new Notificacion();
        notificacion.setNotificacionId(notificacionDto.getNotificacionId());
        notificacion.setMensaje(notificacionDto.getMensaje());
        notificacion.setFecha(notificacionDto.getFecha());
        notificacion.setLeida(notificacionDto.getLeida());
        // La relación con Usuario debe ser gestionada en el servicio
        return notificacion;
    }
}
