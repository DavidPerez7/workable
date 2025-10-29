package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.MunicipioDto;
import com.workable_sb.workable.models.Municipio;

@Component
public class MunicipioMapperImpl implements MunicipioMapper {
    
    @Override
    public Municipio toEntity(MunicipioDto dto) {
        if (dto == null) return null;
        
        Municipio municipio = new Municipio();
        municipio.setId(dto.getMun_id());
        municipio.setNombre(dto.getNom());
        
        return municipio;
    }

    @Override
    public MunicipioDto toDto(Municipio entity) {
        if (entity == null) return null;
        
        MunicipioDto dto = new MunicipioDto();
        dto.setMun_id(entity.getId());
        dto.setNom(entity.getNombre());
        
        if (entity.getDepartamento() != null) {
            dto.setDepar_id(entity.getDepartamento().getId());
            dto.setNom_depar(entity.getDepartamento().getNombre());
        }
        
        return dto;
    }
}
