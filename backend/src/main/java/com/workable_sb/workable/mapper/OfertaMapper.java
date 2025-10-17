package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.OfertaDto;
import com.workable_sb.workable.dto.OfertaReadDto;
import com.workable_sb.workable.models.Oferta;

public interface OfertaMapper {
    Oferta consult(OfertaDto ofertaDto);
    OfertaReadDto consulReadDto(Oferta entity);
}
