package com.workable_sb.workable.mapper.oferta;

import com.workable_sb.workable.dto.oferta.OfertaModalidadCreateDTO;
import com.workable_sb.workable.models.OfertaModalidad;

public interface OfertaModalidadMapper {
    OfertaModalidad toEntity(OfertaModalidadCreateDTO dto);
}
