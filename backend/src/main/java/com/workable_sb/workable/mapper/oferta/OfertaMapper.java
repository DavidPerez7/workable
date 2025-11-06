package com.workable_sb.workable.mapper.oferta;

import com.workable_sb.workable.dto.oferta.OfertaCreateDTO;
import com.workable_sb.workable.dto.oferta.OfertaReadDTO;
import com.workable_sb.workable.models.Oferta;

public interface OfertaMapper {
    Oferta toEntity(OfertaCreateDTO dto);
    OfertaReadDTO toDto(Oferta entity);
}
