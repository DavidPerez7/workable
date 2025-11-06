package com.workable_sb.workable.mapper.empresa;

import com.workable_sb.workable.dto.empresa.EmpresaCategoriaCreateDTO;
import com.workable_sb.workable.dto.empresa.EmpresaCategoriaReadDTO;
import com.workable_sb.workable.models.EmpresaCategoria;

public interface EmpresaCategoriaMapper {
    EmpresaCategoria toEntity(EmpresaCategoriaCreateDTO dto);
    EmpresaCategoriaReadDTO toDto(EmpresaCategoria entity);
}
