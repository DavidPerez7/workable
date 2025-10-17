package com.workable_sb.workable.service;

import java.util.List;
import java.util.Optional;

import com.workable_sb.workable.dto.AspiranteDto;
import com.workable_sb.workable.dto.AspiranteReadDto;
import com.workable_sb.workable.dto.LoginDto;

public interface AspiranteService {
  AspiranteReadDto guardar(AspiranteDto aspiranteDto);
  AspiranteReadDto listId(Integer id);
  List<AspiranteReadDto> listarAll();
  void eliminar(Integer id);
  Optional<AspiranteReadDto> login(LoginDto LoginDto);
}
