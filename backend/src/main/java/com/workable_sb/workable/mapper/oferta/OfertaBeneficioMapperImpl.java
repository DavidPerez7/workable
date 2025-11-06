
package com.workable_sb.workable.mapper.oferta;

import com.workable_sb.workable.dto.oferta.OfertaBeneficioCreateDTO;
import com.workable_sb.workable.models.OfertaBeneficio;
import org.springframework.stereotype.Component;

@Component
public class OfertaBeneficioMapperImpl implements OfertaBeneficioMapper {
    public OfertaBeneficio toEntity(OfertaBeneficioCreateDTO dto) {
        OfertaBeneficio beneficio = new OfertaBeneficio();
        beneficio.setNombre(dto.getNombre());
        beneficio.setEstado(dto.getEstado());
        return beneficio;
    }

    public OfertaBeneficioCreateDTO toDTO(OfertaBeneficio beneficio) {
        return new OfertaBeneficioCreateDTO(
            beneficio.getNombre(),
            beneficio.getEstado()
        );
    }
}
