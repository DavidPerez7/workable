package com.workable_sb.workable.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostulacionCreateRequest {
    
    @NotNull(message = "El ID del aspirante es obligatorio")
    private Long aspiranteId;
    
    @NotNull(message = "El ID de la oferta es obligatorio")
    private Long ofertaId;
}
