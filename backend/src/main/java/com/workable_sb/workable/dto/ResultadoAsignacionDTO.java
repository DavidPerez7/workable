package com.workable_sb.workable.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultadoAsignacionDTO {
    private Integer aspiranteId;      // ID del aspirante
    private Short discapacidadId;     // ID de la discapacidad
    private String estado;            // "ASIGNADO", "DUPLICADO" o "ERROR"
    private String mensaje;           // Mensaje adicional
}
