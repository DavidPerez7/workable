package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.DataEstudioDto;
import com.workable_sb.workable.models.DataEstudio;

public interface DataEstudioMapper {
    DataEstudio toEntity(DataEstudioDto dto);
    DataEstudioDto toDto(DataEstudio entity);
}
