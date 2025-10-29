package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.DataExperienciaDto;
import com.workable_sb.workable.models.DataExperiencia;

public interface DataExperienciaMapper {
    DataExperiencia toEntity(DataExperienciaDto dto);
    DataExperienciaDto toDto(DataExperiencia entity);
}
