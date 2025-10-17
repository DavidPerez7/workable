package com.workable_sb.workable.service;

import java.util.List;

import com.workable_sb.workable.dto.ValoracionDto;
import com.workable_sb.workable.dto.ValoracionReadDto;

public interface ValoracionService {
  ValoracionReadDto crear(ValoracionDto valoracionDto);
  ValoracionReadDto listarId(Integer id);
  List<ValoracionReadDto> listarAll();
  void eliminar(Integer id);
}
