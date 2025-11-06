package com.workable_sb.workable.mapper.oferta;

import com.workable_sb.workable.dto.oferta.OfertaModalidadCreateDTO;
import com.workable_sb.workable.models.OfertaModalidad;
import org.springframework.stereotype.Component;

@Component
public class OfertaModalidadMapperImpl implements OfertaModalidadMapper {
    @Override
    public OfertaModalidad toEntity(OfertaModalidadCreateDTO dto) {
        OfertaModalidad modalidad = new OfertaModalidad();
        modalidad.setNombre(dto.getNombre() != null ? dto.getNombre().trim() : null);
        if (dto.getEstado() != null) {
            modalidad.setEstado(dto.getEstado());
        }
        return modalidad;
    }
}
