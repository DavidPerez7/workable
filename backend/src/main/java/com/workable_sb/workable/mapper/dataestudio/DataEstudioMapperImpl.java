package com.workable_sb.workable.mapper.dataestudio;

import java.util.Objects;

import org.springframework.stereotype.Component;
import com.workable_sb.workable.dto.dataestudio.DataEstudioDto;
import com.workable_sb.workable.dto.dataestudio.DataEstudioReadDto;
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
        if (dto == null) return null;
        DataEstudio entity = new DataEstudio();
        entity.setId(dto.getId());
        entity.setNombre(dto.getNombre());
        entity.setFechaInicio(dto.getFechaInicio());
        entity.setFechaFin(dto.getFechaFin());
        entity.setEnCurso(dto.getEnCurso());
        entity.setInstitucion(dto.getInstitucion());
        entity.setCertificadoUrl(dto.getCertificadoUrl());
        if (dto.getNivelEducativoId() != null) {
            NivelEducativo nivel = nivelEducativoRepository.findById(Objects.requireNonNull(dto.getNivelEducativoId()))
                .orElseThrow(() -> new EntityNotFoundException("NivelEducativo no encontrado"));
            entity.setNivelEducativo(nivel);
        }
        if (dto.getUsuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(Objects.requireNonNull(dto.getUsuarioId()))
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
            entity.setUsuario(usuario);
        }
        if (dto.getEstado() != null) {
            entity.setEstado(DataEstudio.EstadoType.valueOf(dto.getEstado()));
        }
        return entity;
    }

    @Override
    public DataEstudioReadDto toReadDto(DataEstudio entity) {
        if (entity == null) return null;
        DataEstudioReadDto dto = new DataEstudioReadDto();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setFechaInicio(entity.getFechaInicio());
        dto.setFechaFin(entity.getFechaFin());
        dto.setEnCurso(entity.getEnCurso());
        dto.setInstitucion(entity.getInstitucion());
        dto.setCertificadoUrl(entity.getCertificadoUrl());
        if (entity.getNivelEducativo() != null) {
            dto.setNivelEducativoId(entity.getNivelEducativo().getId());
            dto.setNivelEducativoNombre(entity.getNivelEducativo().getNombre());
        }
        if (entity.getUsuario() != null) {
            dto.setUsuarioId(entity.getUsuario().getId());
        }
        dto.setEstado(entity.getEstado().name());
        return dto;
    }
}
