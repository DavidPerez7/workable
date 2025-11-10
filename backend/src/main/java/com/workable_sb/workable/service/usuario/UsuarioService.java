package com.workable_sb.workable.service.usuario;

import com.workable_sb.workable.dto.usuario.UsuarioDto;
import com.workable_sb.workable.dto.usuario.UsuarioReadDto;

import java.util.List;

public interface UsuarioService {
    UsuarioDto create(UsuarioDto usuarioDto);
    UsuarioReadDto findById(Integer id);  // Retorna ReadDto sin clave
    List<UsuarioReadDto> findAll();  // Retorna ReadDto sin clave
    UsuarioReadDto update(Integer id, UsuarioDto usuarioDto);
    void delete(Integer id);
    boolean cambiarEstado(Integer id, com.workable_sb.workable.models.Usuario.EstadoUsr estado);

    UsuarioReadDto findByNombre(String nombre);
}
