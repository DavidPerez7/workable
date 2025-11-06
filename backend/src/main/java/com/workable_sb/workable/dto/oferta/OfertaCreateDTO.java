package com.workable_sb.workable.dto.oferta;

import com.workable_sb.workable.models.Oferta;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OfertaCreateDTO {
    
    @NotBlank(message = "El título es obligatorio")
    @Size(max = 255, message = "El título no puede exceder 255 caracteres")
    private String titulo;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 255, message = "La descripción no puede exceder 255 caracteres")
    private String descripcion;

    @NotBlank(message = "La ubicación es obligatoria")
    @Size(max = 100, message = "La ubicación no puede exceder 100 caracteres")
    private String ubicacion;

    @NotNull(message = "La fecha límite es obligatoria")
    @Future(message = "La fecha límite debe ser futura")
    private LocalDate fechaLimite;
    
    @NotNull(message = "El salario es obligatorio")
    @Min(value = 0, message = "El salario debe ser mayor o igual a 0")
    private Long salario;
    
    private Oferta.EstadoOferta estado; // Opcional, por defecto ABIERTA
    
    private Set<String> requisitos; // Opcional
    
    @NotNull(message = "El municipio es obligatorio")
    private Integer municipioId;

    @NotNull(message = "La modalidad es obligatoria")
    private Integer modalidadId;

    @NotNull(message = "El tipo de contrato es obligatorio")
    private Integer tipoContratoId;

    @NotNull(message = "La empresa es obligatoria")
    private Long empresaId;
    
    private Integer reclutadorId;  // Opcional, puede ser seteado por el sistema
    
    private Set<Integer> beneficiosIds; // IDs de los beneficios asociados
}
