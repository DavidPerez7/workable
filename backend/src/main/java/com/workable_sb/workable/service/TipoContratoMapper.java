package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.TipoContratoCreateDTO;
import com.workable_sb.workable.models.TipoContrato;

public class TipoContratoMapper {
    public static TipoContrato toEntity(TipoContratoCreateDTO dto) {
        TipoContrato tipoContrato = new TipoContrato();
        tipoContrato.setNombre(dto.getNombre().trim());
        if (dto.getEstado() != null) {
            tipoContrato.setEstado(dto.getEstado());
        }
        return tipoContrato;
    }
}
