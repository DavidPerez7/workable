package com.workable_sb.workable.mapper.nivelEducativo;

import com.workable_sb.workable.dto.nivelEducativo.NivelEducativoDto;
import com.workable_sb.workable.models.NivelEducativo;

public interface NivelEducativoMapper {
    NivelEducativoDto toDto(NivelEducativo nivel);
    NivelEducativo toEntity(NivelEducativoDto dto);
}
