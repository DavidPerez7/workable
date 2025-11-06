package com.workable_sb.workable.dto.oferta;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OfertaReadDTO {
    
    private Integer id;
    private String titulo;
    private String descripcion;
    private String ubicacion;
    private LocalDate fechaLimite;
    private LocalDate fechaPublicacion;
    private Long salario;
    private String estado; // "ABIERTA", "CERRADA", "PAUSADA" (del enum convertido a String)
    private Set<String> requisitos;
    
    // IDs de relaciones
    private Integer municipioId;
    private String municipioNombre;
    
    private Integer modalidadId;
    private String modalidadNombre;
    
    private Integer tipoContratoId;
    private String tipoContratoNombre;
    
    private Long empresaId;
    private String empresaNombre;
    
    private Integer reclutadorId;
    private String reclutadorNombre;
    
    private Set<BeneficioSimpleDTO> beneficios; // Beneficios simplificados
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BeneficioSimpleDTO {
        private Integer id;
        private String nombre;
    }
}
