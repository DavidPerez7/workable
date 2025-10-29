package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.UsuarioDto;
import com.workable_sb.workable.dto.UsuarioReadDto;
import java.util.List;

public interface UsuarioService {
    UsuarioDto create(UsuarioDto usuarioDto);
    UsuarioReadDto findById(Integer id);  // Retorna ReadDto sin clave
    List<UsuarioReadDto> findAll();  // Retorna ReadDto sin clave
    UsuarioDto update(Integer id, UsuarioDto usuarioDto);
    void delete(Integer id);
}
