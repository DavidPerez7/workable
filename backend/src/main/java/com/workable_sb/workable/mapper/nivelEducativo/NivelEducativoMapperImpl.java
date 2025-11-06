package com.workable_sb.workable.mapper.nivelEducativo;

import com.workable_sb.workable.dto.nivelEducativo.NivelEducativoDto;
import com.workable_sb.workable.models.NivelEducativo;
import org.springframework.stereotype.Component;

@Component
public class NivelEducativoMapperImpl implements NivelEducativoMapper {
    public NivelEducativoDto toDto(NivelEducativo nivel) {
        NivelEducativoDto dto = new NivelEducativoDto();
        dto.setId(nivel.getId());
        dto.setNombre(nivel.getNombre());
        dto.setEstado(nivel.getEstado());
        return dto;
    }
    public NivelEducativo toEntity(NivelEducativoDto dto) {
        NivelEducativo nivel = new NivelEducativo();
        nivel.setId(dto.getId());
        nivel.setNombre(dto.getNombre());
        nivel.setEstado(dto.getEstado());
        return nivel;
    }
}
