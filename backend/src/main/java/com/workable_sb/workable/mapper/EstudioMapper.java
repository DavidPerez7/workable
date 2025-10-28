package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.EstudioDto;
import com.workable_sb.workable.models.DataEstudio;

public interface EstudioMapper {
    DataEstudio toEntity(EstudioDto dto);
    EstudioDto toDto(DataEstudio entity);
}
