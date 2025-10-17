package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.ReclutadorDto;
import com.workable_sb.workable.dto.ReclutadorReadDto;
import com.workable_sb.workable.models.Reclutador;

public interface ReclutadorMapper {
    Reclutador consult(ReclutadorDto reclutadorDto);

    ReclutadorReadDto consultReadDto(Reclutador reclutador);
}
