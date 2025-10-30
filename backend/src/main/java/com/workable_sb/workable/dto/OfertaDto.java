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
    // ID nullable: null al crear, presente al leer/actualizar
    private Integer id;
    
    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    @NotBlank(message = "La ubicación es obligatoria")
    private String ubicacion;
    


    @NotNull(message = "La fecha límite es obligatoria")
    private LocalDate fechaLimite;
    
    private Long salario;
    
    private String estado;  // "ABIERTA", "CERRADA", "PAUSADA"
    
    private Integer municipioId;

    @NotNull(message = "La modalidad es obligatoria")
    private Integer modalidadId;

    @NotNull(message = "El tipo de contrato es obligatorio")
    private Integer tipoContratoId;

    @NotNull(message = "La empresa es obligatoria")
    private Long empresaId;
    
    private Integer reclutadorId;  // Opcional
    
    // Campos de solo lectura (null al crear, llenados por backend al leer)
    private String modalidadNombre;
    private String tipoContratoNombre;
    private String empresaNombre;
    private String reclutadorNombre;
    private LocalDate fechaPublicacion;
}
