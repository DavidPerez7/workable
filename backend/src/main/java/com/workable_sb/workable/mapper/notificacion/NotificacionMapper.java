package com.workable_sb.workable.mapper.notificacion;

import com.workable_sb.workable.dto.notificacion.NotificacionDto;
import com.workable_sb.workable.models.Notificacion;

public interface NotificacionMapper {
    NotificacionDto toDto(Notificacion notificacion);
    Notificacion toEntity(NotificacionDto notificacionDto);
}
