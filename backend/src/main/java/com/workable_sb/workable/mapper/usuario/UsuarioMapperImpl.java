package com.workable_sb.workable.mapper.usuario;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.usuario.UsuarioDto;
import com.workable_sb.workable.dto.usuario.UsuarioReadDto;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.MunicipioRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class UsuarioMapperImpl implements UsuarioMapper {

    private final MunicipioRepository municipioRepository;

    public UsuarioMapperImpl(MunicipioRepository municipioRepository) {
        this.municipioRepository = municipioRepository;
    }

    @Override
    public Usuario toEntity(UsuarioDto usuarioDto) {
        if (usuarioDto == null) return null;
        
        Usuario usuario = new Usuario();
        usuario.setNombre(usuarioDto.getNombre());
        usuario.setCorreo(usuarioDto.getCorreo());
        usuario.setTelefono(usuarioDto.getTelefono());
        usuario.setClave(usuarioDto.getClave());
        usuario.setRol(usuarioDto.getRol());
        usuario.setFotoPerfilUrl(usuarioDto.getFotoPerfilUrl());

        if (usuarioDto.getMunicipio_id() != null) {
            Integer municipioId = java.util.Objects.requireNonNull(usuarioDto.getMunicipio_id(), "El id de municipio no puede ser nulo");
            Municipio municipio = municipioRepository.findById(municipioId)
                .orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
            usuario.setMunicipio(municipio);
        }
        
        return usuario;
    }

    @Override
    public UsuarioDto toDto(Usuario usuario) {
        if (usuario == null) return null;
        
        UsuarioDto dto = new UsuarioDto();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setCorreo(usuario.getCorreo());
        dto.setTelefono(usuario.getTelefono());
        dto.setRol(usuario.getRol());
        dto.setFotoPerfilUrl(usuario.getFotoPerfilUrl());
        
        if (usuario.getMunicipio() != null) {
            dto.setMunicipio_id(usuario.getMunicipio().getId());
            dto.setMunicipio_nom(usuario.getMunicipio().getNombre());
        }
        
        return dto;
    }
    
    @Override
    public UsuarioReadDto toReadDto(Usuario usuario) {
        if (usuario == null) return null;
        
        UsuarioReadDto dto = new UsuarioReadDto();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setCorreo(usuario.getCorreo());
        dto.setTelefono(usuario.getTelefono());
        dto.setRol(usuario.getRol());
        dto.setFotoPerfilUrl(usuario.getFotoPerfilUrl());
        
        if (usuario.getMunicipio() != null) {
            dto.setMunicipioId(usuario.getMunicipio().getId());
            dto.setMunicipioNombre(usuario.getMunicipio().getNombre());
        }
        
        return dto;
    }
}
