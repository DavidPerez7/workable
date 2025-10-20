package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.ExperienciaDto;
import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class ExperienciaMapperImple implements ExperienciaMapper {

    private final UsuarioRepository usuarioRepository;

    public ExperienciaMapperImple(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Experiencia toEntity(ExperienciaDto dto) {
        Experiencia experiencia = new Experiencia();
        experiencia.setId(dto.getId());
        experiencia.setCargo(dto.getCarg());
        experiencia.setEmpresa(dto.getEmpr());
        experiencia.setFechaInicio(dto.getFechaIn());
        experiencia.setFechaFin(dto.getFechaFi());
        experiencia.setUbicacion(dto.getUbicacion());

        if (dto.getAspirante_id() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getAspirante_id())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + dto.getAspirante_id()));
            experiencia.setUsuario(usuario);
        } else {
            experiencia.setUsuario(null);
        }

        return experiencia;
    }

    @Override
    public ExperienciaDto toDto(Experiencia entity) {
        Usuario usuario = entity.getUsuario();
        return new ExperienciaDto(
            entity.getId(),
            entity.getCargo(),
            entity.getEmpresa(),
            entity.getFechaInicio(),
            entity.getFechaFin(),
            entity.getUbicacion(),
            usuario != null ? usuario.getId() : null,
            usuario != null ? usuario.getNombre() : null
        );
    }
}
