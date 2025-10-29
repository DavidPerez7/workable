package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.MunicipioDto;
import com.workable_sb.workable.models.Municipio;

public interface MunicipioMapper {
    Municipio toEntity(MunicipioDto dto);
    MunicipioDto toDto(Municipio entity);
}
