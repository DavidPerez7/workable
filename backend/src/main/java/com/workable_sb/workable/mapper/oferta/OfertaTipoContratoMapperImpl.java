package com.workable_sb.workable.mapper.oferta;

import com.workable_sb.workable.dto.oferta.OfertaTipoContratoCreateDTO;
import com.workable_sb.workable.dto.oferta.OfertaTipoContratoReadDTO;
import com.workable_sb.workable.models.OfertaTipoContrato;
import org.springframework.stereotype.Component;

@Component
public class OfertaTipoContratoMapperImpl implements OfertaTipoContratoMapper {
    @Override
    public OfertaTipoContrato toEntity(OfertaTipoContratoCreateDTO dto) {
        OfertaTipoContrato tipoContrato = new OfertaTipoContrato();
        tipoContrato.setNombre(dto.getNombre() != null ? dto.getNombre().trim() : null);
        if (dto.getEstado() != null) {
            tipoContrato.setEstado(dto.getEstado());
        }
        return tipoContrato;
    }

    @Override
    public OfertaTipoContratoReadDTO toDto(OfertaTipoContrato entity) {
        OfertaTipoContratoReadDTO dto = new OfertaTipoContratoReadDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setEstado(entity.getEstado() == OfertaTipoContrato.EstadoTipoContrato.ACTIVO);
        return dto;
    }
}
