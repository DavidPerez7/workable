package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.EmpresaDto;
import com.workable_sb.workable.models.Empresa;

public interface EmpresaMapper {
  Empresa toEntity(EmpresaDto empresaDto);
  EmpresaDto toDto(Empresa empresa);
}
