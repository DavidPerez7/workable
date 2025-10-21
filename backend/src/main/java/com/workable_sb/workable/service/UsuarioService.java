package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.UsuarioDto;
import java.util.List;

public interface UsuarioService {
    UsuarioDto create(UsuarioDto usuarioDto);
    UsuarioDto findById(Integer id);
    List<UsuarioDto> findAll();
    UsuarioDto update(Integer id, UsuarioDto usuarioDto);
    void delete(Integer id);
}
