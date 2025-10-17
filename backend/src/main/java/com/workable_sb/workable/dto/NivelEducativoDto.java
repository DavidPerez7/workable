package com.workable_sb.workable.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NivelEducativoDto {
    private Integer nivelEducativo_id;

    @NotNull
    private String nom;
}
