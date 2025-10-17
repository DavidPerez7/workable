package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.DatoEstudioDto;
import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.DatoEstudio;
import com.workable_sb.workable.models.NivelEducativo;
import com.workable_sb.workable.repositories.AspiranteRepository;
import com.workable_sb.workable.repositories.NivelEducativoRepository;

import jakarta.persistence.EntityNotFoundException;

@Component
public class DatoEstudioMapperImple implements DatoEstudioMapper {

    private NivelEducativoRepository nivelEducativoRepository;
    private AspiranteRepository aspiranteRepository;

    public DatoEstudioMapperImple(NivelEducativoRepository nivelEducativoRepository, AspiranteRepository aspiranteRepository) {
        this.nivelEducativoRepository = nivelEducativoRepository;
        this.aspiranteRepository = aspiranteRepository;
    }

    @Override
    public DatoEstudio consult(DatoEstudioDto datoEstudioDto) {
        DatoEstudio datoEstudio = new DatoEstudio();
        datoEstudio.setEstudio_id(datoEstudioDto.getEst_id());
        datoEstudio.setNombre(datoEstudioDto.getNom());
        datoEstudio.setFechaInicio(datoEstudioDto.getFechaIn());
        datoEstudio.setFechaFin(datoEstudioDto.getFechaFi());
        datoEstudio.setCertificado(datoEstudioDto.getCert());
        datoEstudio.setInstitucion(datoEstudioDto.getInst());

        NivelEducativo nivelEducativo = nivelEducativoRepository.findById(datoEstudioDto.getNivEdu_id()).orElseThrow(() -> new EntityNotFoundException("Nivel educativo no encontrado"));
        datoEstudio.setNivelEducativo(nivelEducativo);

        Aspirante aspirante = aspiranteRepository.findById(datoEstudioDto.getAsp_id()).orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        datoEstudio.setAspirante(aspirante);

        return datoEstudio;
    }

    @Override
    public DatoEstudioDto consultDto(DatoEstudio entity) {
        return new DatoEstudioDto(
            entity.getEstudio_id(),
            entity.getNombre(),
            entity.getFechaInicio(),
            entity.getFechaFin(),
            entity.getCertificado(),
            entity.getInstitucion(),
            entity.getNivelEducativo().getNivelEducativo_id(),
            entity.getNivelEducativo().getNombre(),
            entity.getAspirante().getAspiranteId()
        );
    }
}
