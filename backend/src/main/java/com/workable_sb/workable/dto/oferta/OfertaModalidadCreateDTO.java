package com.workable_sb.workable.dto.oferta;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.workable_sb.workable.models.OfertaModalidad;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OfertaModalidadCreateDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no debe superar 100 caracteres")
    private String nombre;

    private OfertaModalidad.EstadoModalidad estado = OfertaModalidad.EstadoModalidad.ACTIVO;
}
