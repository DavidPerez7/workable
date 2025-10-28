package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.InfoAspiranteDto;
import com.workable_sb.workable.models.DataAspirante;

public interface InfoPersonalMapper {
    DataAspirante toEntity(InfoAspiranteDto dto);
    InfoAspiranteDto toDto(DataAspirante entity);
}
    