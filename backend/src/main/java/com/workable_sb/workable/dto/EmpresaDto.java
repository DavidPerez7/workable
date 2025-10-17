package com.workable_sb.workable.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaDto {
  @NotBlank
  private String nom;

  @NotNull
  private String ubi;

  @NotBlank
  private String desc;

  @NotNull
  private Integer numTrab;

  @NotBlank
  private String correoCorp;

  @NotNull(message = "la categoria es obligatoria")
  private Integer cat_id;

  @NotNull(message = "el municipio es obligatorio")
  private Integer munici_id;
}
