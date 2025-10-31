package com.workable_sb.workable.service;

import java.util.List;

import com.workable_sb.workable.dto.EmpresaDto;

public interface EmpresaService {
  EmpresaDto guardar(EmpresaDto empresaDto);
  EmpresaDto guardarYVincularReclutador(EmpresaDto empresaDto, String correoReclutador);
  EmpresaDto actualizar(Long id, EmpresaDto empresaDto, String correoReclutador);
  void eliminar(Long id, String correoReclutador);
  EmpresaDto listId(Long id);
  List<EmpresaDto> listAll();
}
