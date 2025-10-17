package com.workable_sb.workable.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReclutadorDto {
    @NotBlank
    private String nom;

    @NotBlank
    private String clave;

    @NotBlank
    private String corr;

    @NotNull
    private Long tel;

    @NotNull(message = "el id de empresa es obligatorio")
    private Long empresa_id;
}
