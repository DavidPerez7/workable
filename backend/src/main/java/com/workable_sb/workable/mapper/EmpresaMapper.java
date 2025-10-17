package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.EmpresaDto;
import com.workable_sb.workable.dto.EmpresaReadDto;
import com.workable_sb.workable.models.Empresa;

public interface EmpresaMapper {
  Empresa consultEntity(EmpresaDto empresaDto);
  EmpresaReadDto consultReadDto(Empresa empresa);
}
