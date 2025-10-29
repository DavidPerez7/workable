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
        estudio.setNombre(dto.getNom());
        estudio.setFechaInicio(dto.getFechaIn());
        estudio.setFechaFin(dto.getFechaFi());
        estudio.setEnCurso(dto.getEnCurso());
        estudio.setCertificadoUrl(dto.getCert());
        estudio.setInstitucion(dto.getInst());

        if (dto.getNivEdu_id() != null) {
            NivelEducativo nivelEducativo = nivelEducativoRepository.findById(dto.getNivEdu_id())
                .orElseThrow(() -> new EntityNotFoundException("Nivel educativo no encontrado"));
            estudio.setNivelEducativo(nivelEducativo);
        }

        if (dto.getAsp_id() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getAsp_id())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
            estudio.setUsuario(usuario);
        }

        return estudio;
    }

    @Override
    public DataEstudioDto toDto(DataEstudio entity) {
        DataEstudioDto dto = new DataEstudioDto();
        dto.setId(entity.getId());
        dto.setNom(entity.getNombre());
        dto.setFechaIn(entity.getFechaInicio());
        dto.setFechaFi(entity.getFechaFin());
        dto.setEnCurso(entity.getEnCurso());
        dto.setCert(entity.getCertificadoUrl());
        dto.setInst(entity.getInstitucion());
        
        if (entity.getNivelEducativo() != null) {
            dto.setNivEdu_id(entity.getNivelEducativo().getId());
            dto.setNivEdu_nom(entity.getNivelEducativo().getNombre());
        }
        
        if (entity.getUsuario() != null) {
            dto.setAsp_id(entity.getUsuario().getId());
        }
        
        return dto;
    }
}
