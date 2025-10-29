package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.UsrReclutadorDto;
import com.workable_sb.workable.dto.UsrReclutadorReadDto;
import com.workable_sb.workable.models.UsrReclutador;

public interface UsrReclutadorMapper {
    UsrReclutador toEntity(UsrReclutadorDto dto);
    UsrReclutadorDto toDto(UsrReclutador entity);
    UsrReclutadorReadDto toReadDto(UsrReclutador entity);  // Sin clave
}
