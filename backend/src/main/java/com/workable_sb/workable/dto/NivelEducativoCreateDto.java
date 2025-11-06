package com.workable_sb.workable.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NivelEducativoCreateDto {
    @NotBlank
    @Size(max = 100)
    private String nombre;
}
