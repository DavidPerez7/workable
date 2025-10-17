package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.AdministradorDto;
import com.workable_sb.workable.models.Administrador;

public interface AdministradorMapper {
    AdministradorDto toDto(Administrador administrador);
    Administrador toEntity(AdministradorDto administradorDto);
    // pu
}
