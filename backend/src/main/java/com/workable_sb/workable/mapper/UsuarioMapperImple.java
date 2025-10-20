package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;
import com.workable_sb.workable.dto.UsuarioDto;
import com.workable_sb.workable.models.Usuario;

@Component
public class UsuarioMapperImple implements UsuarioMapper {
    @Override
    public UsuarioDto toDto(Usuario usuario) {
        if (usuario == null) return null;
        UsuarioDto dto = new UsuarioDto();
        dto.setUsuarioId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setCorreo(usuario.getCorreo());
        dto.setRol(usuario.getRol());
        return dto;
    }

    @Override
    public Usuario toEntity(UsuarioDto usuarioDto) {
        if (usuarioDto == null) return null;
        Usuario usuario = new Usuario();
        usuario.setId(usuarioDto.getUsuarioId());
        usuario.setNombre(usuarioDto.getNombre());
        usuario.setCorreo(usuarioDto.getCorreo());
        usuario.setRol(usuarioDto.getRol());
        return usuario;
    }
}
