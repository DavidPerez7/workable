package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;

import com.workable_sb.workable.dto.DatoExperienciaDto;
import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.DatoExperiencia;
import com.workable_sb.workable.repositories.AspiranteRepository;


import jakarta.persistence.EntityNotFoundException;

@Component
public class DatoExperienciaMapperImple implements DatoExperienciaMapper {

    private final AspiranteRepository aspiranteRepository;

    public DatoExperienciaMapperImple(AspiranteRepository aspiranteRepository) {
        this.aspiranteRepository = aspiranteRepository;
    }

    @Override
    public DatoExperiencia consult(DatoExperienciaDto datoExperienciaDto) {
        DatoExperiencia datoExperiencia = new DatoExperiencia();
        datoExperiencia.setExperiencia_id(datoExperienciaDto.getExp_id());
        datoExperiencia.setCargo(datoExperienciaDto.getCarg());
        datoExperiencia.setEmpresa(datoExperienciaDto.getEmpr());
        datoExperiencia.setFechaInicio(datoExperienciaDto.getFechaIn());
        datoExperiencia.setFechaFin(datoExperienciaDto.getFechaFi());
        datoExperiencia.setUbicacion(datoExperienciaDto.getUbicacion());

        if (datoExperienciaDto.getAspirante_id() != null) {
            Aspirante aspirante = aspiranteRepository.findById(datoExperienciaDto.getAspirante_id())
            .orElseThrow(() -> new EntityNotFoundException("Aspirante no encontrado con ID: " + datoExperienciaDto.getAspirante_id()));
            datoExperiencia.setAspirante(aspirante);
        } else {
            datoExperiencia.setAspirante(null);
        }

        return datoExperiencia;
    }

    @Override
    public DatoExperienciaDto consultDto(DatoExperiencia entity) {
    return new DatoExperienciaDto(
            entity.getExperiencia_id(),
            entity.getCargo(),
            entity.getEmpresa(),
            entity.getFechaInicio(),
            entity.getFechaFin(),
            entity.getUbicacion(),
            entity.getAspirante().getAspiranteId(),
            entity.getAspirante().getNombre());
    }
}
