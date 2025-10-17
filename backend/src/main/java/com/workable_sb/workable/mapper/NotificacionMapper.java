package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.NotificacionDto;
import com.workable_sb.workable.models.Notificacion;

public interface NotificacionMapper {
    NotificacionDto toDto(Notificacion notificacion);
    Notificacion toEntity(NotificacionDto notificacionDto);
}
