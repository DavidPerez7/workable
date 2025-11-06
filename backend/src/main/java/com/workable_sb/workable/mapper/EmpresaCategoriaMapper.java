package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.EmpresaCategoriaDto;
import com.workable_sb.workable.models.EmpresaCategoria;

public interface EmpresaCategoriaMapper {
    EmpresaCategoria toEntity(EmpresaCategoriaDto dto);
    EmpresaCategoriaDto toDto(EmpresaCategoria entity);
}
