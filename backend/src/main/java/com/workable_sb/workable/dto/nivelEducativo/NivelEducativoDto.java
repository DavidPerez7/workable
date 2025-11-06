package com.workable_sb.workable.dto.nivelEducativo;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NivelEducativoDto {
    private Integer id;

    @NotNull(message = "El nombre es obligatorio")
    private String nombre;
    private com.workable_sb.workable.models.NivelEducativo.Estado estado;
}
