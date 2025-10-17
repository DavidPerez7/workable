package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.DatoExperienciaDto;
import com.workable_sb.workable.models.DatoExperiencia;

public interface DatoExperienciaMapper {
    DatoExperiencia consult(DatoExperienciaDto datoExperienciaDto);
    DatoExperienciaDto consultDto(DatoExperiencia entity);
}
