package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.DataExperienciaDto;
import com.workable_sb.workable.models.DataExperiencia;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class DataExperienciaMapperImpl implements DataExperienciaMapper {

    private final UsuarioRepository usuarioRepository;

    public DataExperienciaMapperImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public DataExperiencia toEntity(DataExperienciaDto dto) {
        DataExperiencia experiencia = new DataExperiencia();
        experiencia.setId(dto.getId());
        experiencia.setCargo(dto.getCarg());
        experiencia.setEmpresa(dto.getEmpr());
        experiencia.setDescripcion(dto.getDescripcion());
        experiencia.setFechaInicio(dto.getFechaIn());
        experiencia.setFechaFin(dto.getFechaFi());
        experiencia.setTrabajoActual(dto.getTrabajoActual());
        experiencia.setUbicacion(dto.getUbicacion());

        if (dto.getAspirante_id() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getAspirante_id())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + dto.getAspirante_id()));
            experiencia.setUsuario(usuario);
        }

        return experiencia;
    }

    @Override
    public DataExperienciaDto toDto(DataExperiencia entity) {
        Usuario usuario = entity.getUsuario();
        DataExperienciaDto dto = new DataExperienciaDto();
        dto.setId(entity.getId());
        dto.setCarg(entity.getCargo());
        dto.setEmpr(entity.getEmpresa());
        dto.setDescripcion(entity.getDescripcion());
        dto.setFechaIn(entity.getFechaInicio());
        dto.setFechaFi(entity.getFechaFin());
        dto.setTrabajoActual(entity.getTrabajoActual());
        dto.setUbicacion(entity.getUbicacion());
        dto.setAspirante_id(usuario != null ? usuario.getId() : null);
        dto.setNombreAspirante(usuario != null ? usuario.getNombre() : null);
        
        return dto;
    }
}
