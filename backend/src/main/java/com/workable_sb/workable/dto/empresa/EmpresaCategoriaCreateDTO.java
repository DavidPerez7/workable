package com.workable_sb.workable.dto.empresa;

import com.workable_sb.workable.models.EmpresaCategoria;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmpresaCategoriaCreateDTO {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombre;

    @Size(max = 255, message = "La URL de la imagen no debe exceder 255 caracteres")
    private String imagenUrl;

    @Size(max = 500, message = "La descripción no debe exceder 500 caracteres")
    private String descripcion;

    private EmpresaCategoria.EstadoCategoria estado;
}
