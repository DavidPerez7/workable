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
  @NotNull(message = "el NIT es obligatorio")
  private Long nit_id;
  
  @NotBlank(message = "el nombre es obligatorio")
  private String nom;

  @NotBlank(message = "la ubicacion es obligatoria")
  private String ubi;

  @NotBlank(message = "la descripcion es obligatoria")
  private String desc;

  @NotNull(message = "el numero de trabajadores es obligatorio")
  private Integer numTrab;

  @NotBlank(message = "el correo corporativo es obligatorio")
  private String correoCorp;

  @NotNull(message = "la categoria es obligatoria")
  private Integer cat_id;

  @NotNull(message = "el municipio es obligatorio")
  private Integer munici_id;
}
