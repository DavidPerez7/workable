package com.workable_sb.workable.service;

import java.util.List;

import com.workable_sb.workable.dto.EmpresaDto;

public interface EmpresaService {
  EmpresaDto guardar(EmpresaDto empresaDto);
  EmpresaDto listId(Long id);
  List<EmpresaDto> listAll();
  void eliminar(Long id);
}
