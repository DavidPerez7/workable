package com.workable_sb.workable.mapper.empresa;

import com.workable_sb.workable.dto.empresa.EmpresaDto;
import com.workable_sb.workable.models.Empresa;

public interface EmpresaMapper {
  Empresa toEntity(EmpresaDto empresaDto);
  EmpresaDto toDto(Empresa empresa);
}
