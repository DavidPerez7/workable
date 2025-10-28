package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.InfoAspiranteDto;
import com.workable_sb.workable.models.UsrAspirante;

public interface InfoPersonalMapper {
    UsrAspirante toEntity(InfoAspiranteDto dto);
    InfoAspiranteDto toDto(UsrAspirante entity);
}
    