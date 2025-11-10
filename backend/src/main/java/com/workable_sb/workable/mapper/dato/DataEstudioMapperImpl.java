package com.workable_sb.workable.mapper.dato;

import java.util.Objects;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.dato.DataEstudioDto;
import com.workable_sb.workable.models.DataEstudio;
import com.workable_sb.workable.models.NivelEducativo;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.NivelEducativoRepository;
import com.workable_sb.workable.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class DataEstudioMapperImpl implements DataEstudioMapper {

    private final NivelEducativoRepository nivelEducativoRepository;
    private final UsuarioRepository usuarioRepository;

    public DataEstudioMapperImpl(NivelEducativoRepository nivelEducativoRepository, UsuarioRepository usuarioRepository) {
        this.nivelEducativoRepository = nivelEducativoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public DataEstudio toEntity(DataEstudioDto dto) {
        DataEstudio estudio = new DataEstudio();
        estudio.setId(dto.getId());
        estudio.setNombre(dto.getNombre());
        estudio.setFechaInicio(dto.getFechaInicio());
        estudio.setFechaFin(dto.getFechaFin());
        estudio.setEnCurso(dto.getEnCurso());
        estudio.setCertificadoUrl(dto.getCertificado());
        estudio.setInstitucion(dto.getInstitucion());

        if (dto.getNivelEducativoId() != null) {
        Integer nivelEducativoId = Objects.requireNonNull(dto.getNivelEducativoId(), "El id de nivel educativo no puede ser nulo");
        NivelEducativo nivelEducativo = nivelEducativoRepository.findById(nivelEducativoId)
            .orElseThrow(() -> new EntityNotFoundException("Nivel educativo no encontrado"));
            estudio.setNivelEducativo(nivelEducativo);
        }

        if (dto.getAspiranteId() != null) {
        Integer aspiranteId = Objects.requireNonNull(dto.getAspiranteId(), "El id de aspirante no puede ser nulo");
        Usuario usuario = usuarioRepository.findById(aspiranteId)
            .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
            estudio.setUsuario(usuario);
        }

        if (dto.getEstado() != null) {
            try {
                estudio.setEstado(DataEstudio.EstadoEstudio.valueOf(dto.getEstado().toUpperCase()));
            } catch (IllegalArgumentException e) {
                estudio.setEstado(DataEstudio.EstadoEstudio.ACTIVO);
            }
        }
        return estudio;
    }

    @Override
    public DataEstudioDto toDto(DataEstudio entity) {
        DataEstudioDto dto = new DataEstudioDto();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setFechaInicio(entity.getFechaInicio());
        dto.setFechaFin(entity.getFechaFin());
        dto.setEnCurso(entity.getEnCurso());
        dto.setCertificado(entity.getCertificadoUrl());
        dto.setInstitucion(entity.getInstitucion());
        
        if (entity.getNivelEducativo() != null) {
            dto.setNivelEducativoId(entity.getNivelEducativo().getId());
            dto.setNivelEducativoNombre(entity.getNivelEducativo().getNombre());
        }
        
        if (entity.getUsuario() != null) {
            dto.setAspiranteId(entity.getUsuario().getId());
        }
        
        if (entity.getEstado() != null) {
            dto.setEstado(entity.getEstado().name());
        }
        return dto;
    }
}
