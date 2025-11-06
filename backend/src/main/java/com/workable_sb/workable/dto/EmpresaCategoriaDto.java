package com.workable_sb.workable.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaCategoriaDto {
    @NotNull
    private Integer id;
    @NotNull(message = "El nombre es obligatorio")
    private String nombre;
    private String imagenUrl;
    private String descripcion;
}
