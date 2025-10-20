package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.ExperienciaDto;
import com.workable_sb.workable.models.Experiencia;

public interface ExperienciaMapper {
    Experiencia toEntity(ExperienciaDto dto);
    ExperienciaDto toDto(Experiencia entity);
}
