package com.workable_sb.workable.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespAsignacionMasivaDTO {
    private int totalSolicitudes;                      // Total de registros recibidos
    private int totalAsignadas;                        // Cantidad de asignaciones exitosas
    private int totalDuplicadas;                       // Cantidad de duplicados
    private int totalErrores;                          // Cantidad de errores
    private List<ResultadoAsignacionDTO> resultados;   // Lista con detalle por asignación
}
