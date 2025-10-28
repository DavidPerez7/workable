package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.UsuarioDto;
import com.workable_sb.workable.models.User;

public interface UsuarioMapper {
    User toEntity(UsuarioDto usuarioDto);
    UsuarioDto toDto(User usuario);
}
