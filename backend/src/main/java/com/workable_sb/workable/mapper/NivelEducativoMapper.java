package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.NivelEducativoDto;
import com.workable_sb.workable.models.NivelEducativo;

public class NivelEducativoMapper {
    public static NivelEducativoDto toDto(NivelEducativo nivel) {
           NivelEducativoDto dto = new NivelEducativoDto();
       dto.setId(nivel.getId());
           dto.setNombre(nivel.getNombre());
           dto.setEstado(nivel.getEstado());
           return dto;
    }
        public static NivelEducativo toEntity(NivelEducativoDto dto) {
           NivelEducativo nivel = new NivelEducativo();
       nivel.setId(dto.getId());
           nivel.setNombre(dto.getNombre());
           nivel.setEstado(dto.getEstado());
           return nivel;
    }
}
