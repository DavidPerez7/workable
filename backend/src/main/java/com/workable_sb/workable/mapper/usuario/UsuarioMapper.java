package com.workable_sb.workable.mapper.usuario;

import com.workable_sb.workable.dto.usuario.UsuarioDto;
import com.workable_sb.workable.dto.usuario.UsuarioReadDto;
import com.workable_sb.workable.models.Usuario;

public interface UsuarioMapper {
    Usuario toEntity(UsuarioDto usuarioDto);
    UsuarioDto toDto(Usuario usuario);
    UsuarioReadDto toReadDto(Usuario usuario);  // Sin clave
}
