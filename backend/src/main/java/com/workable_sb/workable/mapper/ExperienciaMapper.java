package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.ExperienciaDto;
import com.workable_sb.workable.models.DataExperiencia;

public interface ExperienciaMapper {
    DataExperiencia toEntity(ExperienciaDto dto);
    ExperienciaDto toDto(DataExperiencia entity);
}
