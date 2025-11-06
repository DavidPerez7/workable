package com.workable_sb.workable.mapper.notificacion;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.notificacion.NotificacionDto;
import com.workable_sb.workable.models.Notificacion;

@Component
public class NotificacionMapperImpl implements NotificacionMapper {
    @Override
    public NotificacionDto toDto(Notificacion notificacion) {
        if (notificacion == null) return null;
        NotificacionDto dto = new NotificacionDto();
        dto.setId(notificacion.getId());
        dto.setTipo(notificacion.getTipo());
        dto.setTitulo(notificacion.getTitulo());
        dto.setMensaje(notificacion.getMensaje());
        dto.setEnlace(notificacion.getEnlace());
        dto.setFecha(notificacion.getFecha());
        dto.setLeida(notificacion.getLeida());
        if (notificacion.getUsuario() != null) {
            dto.setUsuarioId(notificacion.getUsuario().getId());
        }
        return dto;
    }

    @Override
    public Notificacion toEntity(NotificacionDto notificacionDto) {
        if (notificacionDto == null) return null;
        Notificacion notificacion = new Notificacion();
        notificacion.setId(notificacionDto.getId());
        notificacion.setTipo(notificacionDto.getTipo());
        notificacion.setTitulo(notificacionDto.getTitulo());
        notificacion.setMensaje(notificacionDto.getMensaje());
        notificacion.setEnlace(notificacionDto.getEnlace());
        notificacion.setFecha(notificacionDto.getFecha());
        notificacion.setLeida(notificacionDto.getLeida());
        return notificacion;
    }
}
