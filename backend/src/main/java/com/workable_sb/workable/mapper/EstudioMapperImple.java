package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.EstudioDto;
import com.workable_sb.workable.models.DataEstudio;
import com.workable_sb.workable.models.NivelEducativo;
import com.workable_sb.workable.models.User;
import com.workable_sb.workable.repository.NivelEducativoRepository;
import com.workable_sb.workable.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class EstudioMapperImple implements EstudioMapper {

    private final NivelEducativoRepository nivelEducativoRepository;
    private final UsuarioRepository usuarioRepository;

    public EstudioMapperImple(NivelEducativoRepository nivelEducativoRepository, UsuarioRepository usuarioRepository) {
        this.nivelEducativoRepository = nivelEducativoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public DataEstudio toEntity(EstudioDto datoEstudioDto) {
        DataEstudio estudio = new DataEstudio();
        estudio.setEstudio_id(datoEstudioDto.getId());
        estudio.setNombre(datoEstudioDto.getNom());
        estudio.setFechaInicio(datoEstudioDto.getFechaIn());
        estudio.setFechaFin(datoEstudioDto.getFechaFi());
        estudio.setCertificado(datoEstudioDto.getCert());
        estudio.setInstitucion(datoEstudioDto.getInst());

        NivelEducativo nivelEducativo = nivelEducativoRepository.findById(datoEstudioDto.getNivEdu_id())
            .orElseThrow(() -> new EntityNotFoundException("Nivel educativo no encontrado"));
        estudio.setNivelEducativo(nivelEducativo);

        User usuario = usuarioRepository.findById(datoEstudioDto.getAsp_id())
            .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        estudio.setUsuario(usuario);

        return estudio;
    }

    @Override
    public EstudioDto toDto(DataEstudio entity) {
        return new EstudioDto(
            entity.getEstudio_id(),
            entity.getNombre(),
            entity.getFechaInicio(),
            entity.getFechaFin(),
            entity.getCertificado(),
            entity.getInstitucion(),
            entity.getNivelEducativo().getNivelEducativo_id(),
            entity.getNivelEducativo().getNombre(),
            entity.getUsuario().getId()
        );
    }
}
