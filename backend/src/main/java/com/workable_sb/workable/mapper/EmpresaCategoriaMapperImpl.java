package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.EmpresaCategoriaDto;
import com.workable_sb.workable.models.EmpresaCategoria;

public class EmpresaCategoriaMapperImpl implements EmpresaCategoriaMapper {
    @Override
    public EmpresaCategoria toEntity(EmpresaCategoriaDto dto) {
        if (dto == null) return null;
        EmpresaCategoria entity = new EmpresaCategoria();
        // id se asigna por JPA
        entity.setNombre(dto.getNombre());
        entity.setImagenUrl(dto.getImagenUrl());
        entity.setDescripcion(dto.getDescripcion());
        return entity;
    }
    @Override
    public EmpresaCategoriaDto toDto(EmpresaCategoria entity) {
        if (entity == null) return null;
        EmpresaCategoriaDto dto = new EmpresaCategoriaDto();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setImagenUrl(entity.getImagenUrl());
        dto.setDescripcion(entity.getDescripcion());
        return dto;
    }
}
