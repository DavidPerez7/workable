package com.workable_sb.workable.dto;

import java.sql.Date;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DatoExperienciaDto {
  private Integer exp_id;

  @NotNull
  private String carg;

  @NotNull
  private String empr;

  @NotNull
  private Date fechaIn;

  @NotNull
  private Date fechaFi;

  @NotNull
  private String ubicacion;

  @NotNull(message = "el ID de usuario es obligatorio")
  private Integer aspirante_id;
  private String nombreAspirante;
}
