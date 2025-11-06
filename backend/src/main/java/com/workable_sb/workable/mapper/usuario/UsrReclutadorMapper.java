package com.workable_sb.workable.mapper.usuario;

import com.workable_sb.workable.dto.usuario.UsrReclutadorDto;
import com.workable_sb.workable.dto.usuario.UsrReclutadorReadDto;
import com.workable_sb.workable.models.UsrReclutador;

public interface UsrReclutadorMapper {
    UsrReclutador toEntity(UsrReclutadorDto dto);
    UsrReclutadorDto toDto(UsrReclutador entity);
    UsrReclutadorReadDto toReadDto(UsrReclutador entity);  // Sin clave
}
