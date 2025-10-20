package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.InfoAspiranteDto;
import com.workable_sb.workable.models.InfoAspirante;

public interface InfoPersonalMapper {
    InfoAspirante toEntity(InfoAspiranteDto dto);
    InfoAspiranteDto toDto(InfoAspirante entity);
}
    