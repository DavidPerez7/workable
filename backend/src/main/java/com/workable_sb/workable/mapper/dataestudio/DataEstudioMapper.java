package com.workable_sb.workable.mapper.dataestudio;

import com.workable_sb.workable.dto.dataestudio.DataEstudioDto;
import com.workable_sb.workable.dto.dataestudio.DataEstudioReadDto;
import com.workable_sb.workable.models.DataEstudio;

public interface DataEstudioMapper {
    DataEstudio toEntity(DataEstudioDto dto);
    DataEstudioReadDto toReadDto(DataEstudio entity);
}
