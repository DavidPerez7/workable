package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.UsrAspiranteDto;
import com.workable_sb.workable.dto.UsrAspiranteReadDto;
import com.workable_sb.workable.models.UsrAspirante;

public interface UsrAspiranteMapper {
    UsrAspirante toEntity(UsrAspiranteDto dto);
    UsrAspiranteDto toDto(UsrAspirante entity);
    UsrAspiranteReadDto toReadDto(UsrAspirante entity);  // Sin clave
}
    
