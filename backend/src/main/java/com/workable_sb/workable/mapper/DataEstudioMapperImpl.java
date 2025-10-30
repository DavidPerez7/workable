package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.DataEstudioDto;
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
            NivelEducativo nivelEducativo = nivelEducativoRepository.findById(dto.getNivelEducativoId())
                .orElseThrow(() -> new EntityNotFoundException("Nivel educativo no encontrado"));
            estudio.setNivelEducativo(nivelEducativo);
        }

        if (dto.getAspiranteId() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getAspiranteId())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
            estudio.setUsuario(usuario);
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
        
        return dto;
    }
}
