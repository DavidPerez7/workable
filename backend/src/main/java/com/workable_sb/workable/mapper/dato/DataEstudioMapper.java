package com.workable_sb.workable.mapper.dato;

import com.workable_sb.workable.dto.dato.DataEstudioDto;
import com.workable_sb.workable.models.DataEstudio;

public interface DataEstudioMapper {
    DataEstudio toEntity(DataEstudioDto dto);
    DataEstudioDto toDto(DataEstudio entity);
}
