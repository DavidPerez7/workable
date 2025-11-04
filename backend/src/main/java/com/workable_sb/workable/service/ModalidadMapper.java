package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.ModalidadCreateDTO;
import com.workable_sb.workable.models.Modalidad;

public class ModalidadMapper {
    public static Modalidad toEntity(ModalidadCreateDTO dto) {
        Modalidad modalidad = new Modalidad();
        modalidad.setNombre(dto.getNombre().trim());
        if (dto.getEstado() != null) {
            modalidad.setEstado(dto.getEstado());
        }
        return modalidad;
    }
}
