package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.DatoEstudioDto;
import com.workable_sb.workable.models.DatoEstudio;

public interface DatoEstudioMapper {
    
    DatoEstudio consult(DatoEstudioDto datoEstudioDto);

    DatoEstudioDto consultDto(DatoEstudio entity);
}
