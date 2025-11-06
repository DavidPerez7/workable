package com.workable_sb.workable.dto.oferta;

import com.workable_sb.workable.models.OfertaBeneficio.EstadoBeneficio;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OfertaBeneficioCreateDTO {
    
    @NotBlank(message = "El nombre del beneficio es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;
    
    private EstadoBeneficio estado = EstadoBeneficio.ACTIVO;
}
