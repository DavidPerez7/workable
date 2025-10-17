package com.workable_sb.workable.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MunicipioDto {
  private Integer mun_id;

  @NotNull
  private String nom;

  @NotNull(message = "el departamento es obligatorio")
  private Integer depar_id;

  private String nom_depar;
}
