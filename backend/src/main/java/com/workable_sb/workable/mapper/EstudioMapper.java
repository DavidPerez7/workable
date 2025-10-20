package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.EstudioDto;
import com.workable_sb.workable.models.Estudio;

public interface EstudioMapper {
    Estudio toEntity(EstudioDto dto);
    EstudioDto toDto(Estudio entity);
}
