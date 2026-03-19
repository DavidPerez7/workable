package com.workable_sb.workable.dto;

import com.workable_sb.workable.models.Oferta;

public record OfertaSummaryDTO(
    Long id,
    String titulo,
    String empresaNombre,
    String municipioNombre,
    Long salario,
    Oferta.Modalidad modalidad,
    Oferta.TipoContrato tipoContrato,
    String estado,
    Float puntuacion
) {
    public static OfertaSummaryDTO fromOferta(Oferta oferta) {
        return new OfertaSummaryDTO(
            oferta.getId(),
            oferta.getTitulo(),
            oferta.getEmpresa() != null ? oferta.getEmpresa().getNombre() : null,
            oferta.getMunicipio() != null ? oferta.getMunicipio().getNombre() : null,
            oferta.getSalario(),
            oferta.getModalidad(),
            oferta.getTipoContrato(),
            oferta.getEstado() != null ? oferta.getEstado().name() : null,
            oferta.getPuntuacion()
        );
    }
}
