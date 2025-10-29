package com.workable_sb.workable.dto;

import java.sql.Date;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DataExperienciaDto {
  private Integer id;

  @NotNull
  private String carg;

  @NotNull
  private String empr;
  
  private String descripcion;

  @NotNull
  private Date fechaIn;

  private Date fechaFi;
  
  private Boolean trabajoActual;

  @NotNull
  private String ubicacion;

  @NotNull(message = "el ID de usuario es obligatorio")
  private Integer aspirante_id;
  private String nombreAspirante;
}
