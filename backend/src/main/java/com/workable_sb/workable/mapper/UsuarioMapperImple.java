package com.workable_sb.workable.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.workable_sb.workable.dto.UsuarioDto;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.User;
import com.workable_sb.workable.repository.MunicipioRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class UsuarioMapperImple implements UsuarioMapper {

    @Autowired
    private MunicipioRepository municipioRepository;

    @Override
    public User toEntity(UsuarioDto usuarioDto) {
        if (usuarioDto == null) return null;
        User usuario = new User();
        usuario.setNombre(usuarioDto.getNombre());
        usuario.setCorreo(usuarioDto.getCorreo());
        usuario.setClave(usuarioDto.getClave());
        usuario.setRol(usuarioDto.getRol());
        usuario.setFotoPerfil(usuarioDto.getFotoPerfil());

        Municipio municipio = municipioRepository.findById(usuarioDto.getMunicipio_id())
        .orElseThrow(() -> new EntityNotFoundException("Estado no encontrado"));
        usuario.setMunicipio(municipio);
        
        return usuario;
    }

    @Override
    public UsuarioDto toDto(User usuario) {
        if (usuario == null) return null;
        UsuarioDto dto = new UsuarioDto();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setCorreo(usuario.getCorreo());
        dto.setRol(usuario.getRol());
        dto.setFotoPerfil(usuario.getFotoPerfil());
        dto.setMunicipio_id(usuario.getMunicipio().getMunicipio_id());
        dto.setMunicipio_nom(usuario.getMunicipio().getNombre());
        return dto;
    }
}
