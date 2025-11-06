package com.workable_sb.workable.mapper.empresa;

import com.workable_sb.workable.dto.empresa.EmpresaCategoriaCreateDTO;
import com.workable_sb.workable.dto.empresa.EmpresaCategoriaReadDTO;
import com.workable_sb.workable.models.EmpresaCategoria;
import org.springframework.stereotype.Component;

@Component
public class EmpresaCategoriaMapperImpl implements EmpresaCategoriaMapper {
    @Override
    public EmpresaCategoria toEntity(EmpresaCategoriaCreateDTO dto) {
        if (dto == null) return null;
        
        EmpresaCategoria entity = new EmpresaCategoria();
        entity.setNombre(dto.getNombre() != null ? dto.getNombre().trim() : null);
        entity.setImagenUrl(dto.getImagenUrl() != null ? dto.getImagenUrl().trim() : null);
        entity.setDescripcion(dto.getDescripcion() != null ? dto.getDescripcion().trim() : null);
        
        if (dto.getEstado() != null) {
            entity.setEstado(dto.getEstado());
        }
        
        return entity;
    }

    @Override
    public EmpresaCategoriaReadDTO toDto(EmpresaCategoria entity) {
        if (entity == null) return null;
        
        EmpresaCategoriaReadDTO dto = new EmpresaCategoriaReadDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setImagenUrl(entity.getImagenUrl());
        dto.setDescripcion(entity.getDescripcion());
        dto.setEstado(entity.getEstado());
        
        return dto;
    }
}
