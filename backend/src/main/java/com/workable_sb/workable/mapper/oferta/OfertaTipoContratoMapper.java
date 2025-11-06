package com.workable_sb.workable.mapper.oferta;

import com.workable_sb.workable.models.OfertaTipoContrato;
import com.workable_sb.workable.dto.oferta.OfertaTipoContratoCreateDTO;
import com.workable_sb.workable.dto.oferta.OfertaTipoContratoReadDTO;

public interface OfertaTipoContratoMapper {
    OfertaTipoContrato toEntity(OfertaTipoContratoCreateDTO dto);
    OfertaTipoContratoReadDTO toDto(OfertaTipoContrato entity);
}
