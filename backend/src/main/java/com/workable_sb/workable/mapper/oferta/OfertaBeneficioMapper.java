
package com.workable_sb.workable.mapper.oferta;

import com.workable_sb.workable.dto.oferta.OfertaBeneficioCreateDTO;
import com.workable_sb.workable.models.OfertaBeneficio;

public interface OfertaBeneficioMapper {
    OfertaBeneficio toEntity(OfertaBeneficioCreateDTO dto);
    OfertaBeneficioCreateDTO toDTO(OfertaBeneficio beneficio);
}
