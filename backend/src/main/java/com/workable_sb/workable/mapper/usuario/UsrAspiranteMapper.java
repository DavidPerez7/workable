package com.workable_sb.workable.mapper.usuario;

import com.workable_sb.workable.dto.usuario.UsrAspiranteDto;
import com.workable_sb.workable.dto.usuario.UsrAspiranteReadDto;
import com.workable_sb.workable.models.UsrAspirante;

public interface UsrAspiranteMapper {
    UsrAspirante toEntity(UsrAspiranteDto dto);
    UsrAspiranteDto toDto(UsrAspirante entity);
    UsrAspiranteReadDto toReadDto(UsrAspirante entity);  // Sin clave
}
    
