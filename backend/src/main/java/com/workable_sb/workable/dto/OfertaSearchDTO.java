package com.workable_sb.workable.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

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
}
