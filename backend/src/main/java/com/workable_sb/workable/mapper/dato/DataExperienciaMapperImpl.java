package com.workable_sb.workable.mapper.dato;

import java.util.Objects;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.dato.DataExperienciaDto;
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
        experiencia.setCargo(dto.getCargo());
        experiencia.setEmpresa(dto.getEmpresa());
        experiencia.setDescripcion(dto.getDescripcion());
        experiencia.setFechaInicio(dto.getFechaInicio());
        experiencia.setFechaFin(dto.getFechaFin());
        experiencia.setTrabajoActual(dto.getTrabajoActual());
        experiencia.setUbicacion(dto.getUbicacion());

        Integer aspiranteId = Objects.requireNonNull(dto.getAspiranteId(), "El id de aspirante no puede ser nulo");
        Usuario usuario = usuarioRepository.findById(aspiranteId)
            .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + aspiranteId));
        experiencia.setUsuario(usuario);
        return experiencia;
    }

    @Override
    public DataExperienciaDto toDto(DataExperiencia entity) {
        Usuario usuario = entity.getUsuario();
        DataExperienciaDto dto = new DataExperienciaDto();
        dto.setId(entity.getId());
        dto.setCargo(entity.getCargo());
        dto.setEmpresa(entity.getEmpresa());
        dto.setDescripcion(entity.getDescripcion());
        dto.setFechaInicio(entity.getFechaInicio());
        dto.setFechaFin(entity.getFechaFin());
        dto.setTrabajoActual(entity.getTrabajoActual());
        dto.setUbicacion(entity.getUbicacion());
        dto.setAspiranteId(usuario != null ? usuario.getId() : null);
        dto.setAspiranteNombre(usuario != null ? usuario.getNombre() : null);
        
        return dto;
    }
}
