package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.HojaDeVidaDto;
import com.workable_sb.workable.models.HojaDeVida;

public interface HojaDeVidaMapper {
    HojaDeVidaDto toDto(HojaDeVida hojaDeVida);
    HojaDeVida toEntity(HojaDeVidaDto hojaDeVidaDto);
}
