package com.workable_sb.workable.mapper.dato;

import com.workable_sb.workable.dto.dato.DataExperienciaDto;
import com.workable_sb.workable.models.DataExperiencia;

public interface DataExperienciaMapper {
    DataExperiencia toEntity(DataExperienciaDto dto);
    DataExperienciaDto toDto(DataExperiencia entity);
}
