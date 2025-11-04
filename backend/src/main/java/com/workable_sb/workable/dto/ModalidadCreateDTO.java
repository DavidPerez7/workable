package com.workable_sb.workable.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.workable_sb.workable.models.Modalidad;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModalidadCreateDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no debe superar 100 caracteres")
    private String nombre;

    private Modalidad.EstadoModalidad estado = Modalidad.EstadoModalidad.ACTIVO;
}
