package com.workable_sb.workable.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class OfertaDto {
    @NotBlank
    private String titu;

    @NotBlank
    private String desc;

    @NotBlank
    private String ubi;
    
    private LocalDate fechaPu;

    @NotNull
    private LocalDate fechaLi;
    
    private Long salario;
    
    private String estado;  // "ABIERTA", "CERRADA", "PAUSADA"
    
    private Integer municipio_id;

    @NotNull(message = "La modalidad debe ser obligatoria")
    private Integer modalidad_id;

    @NotNull(message = "El tipo de contrato debe ser obligatorio")
    private Integer tipoContrato_id;

    @NotNull(message = "La empresa debe ser obligatoria")
    private Long empresa_id;
    
    private Integer reclutador_id;  // Opcional
}
