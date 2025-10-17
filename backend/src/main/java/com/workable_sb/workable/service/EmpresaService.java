package com.workable_sb.workable.service;

import java.util.List;

import com.workable_sb.workable.dto.EmpresaDto;
import com.workable_sb.workable.dto.EmpresaReadDto;

public interface EmpresaService {
  EmpresaReadDto guardar(EmpresaDto empresaDto);
  EmpresaReadDto listId(Long id);
  List<EmpresaReadDto> listAll();
  void eliminar(Long id);
}
