package com.workable_sb.workable.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import com.workable_sb.workable.models.Oferta.EstadoOferta;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfertaSearchDTO {
    private String nombre;
    private Long municipioId;
    private BigDecimal salarioMin;
    private BigDecimal salarioMax;
    private String experiencia;
    private String modalidad;
    private String categoria;
    private Long empresaId;
    // Estado de oferta - ACTIVA por defecto (aspirantes siempre ven ofertas activas)
    private EstadoOferta estado = EstadoOferta.ACTIVA;

    public OfertaSearchDTO(String nombre, Long municipioId, BigDecimal salarioMin, BigDecimal salarioMax,
                          String experiencia, String modalidad, String categoria, Long empresaId) {
        this.nombre = nombre;
        this.municipioId = municipioId;
        this.salarioMin = salarioMin;
        this.salarioMax = salarioMax;
        this.experiencia = experiencia;
        this.modalidad = modalidad;
        this.categoria = categoria;
        this.empresaId = empresaId;
        this.estado = EstadoOferta.ACTIVA;
    }
}
