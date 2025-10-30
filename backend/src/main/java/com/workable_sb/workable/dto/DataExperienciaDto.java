package com.workable_sb.workable.dto;

import java.sql.Date;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DataExperienciaDto {
  private Integer id;

  @NotBlank(message = "El cargo es obligatorio")
  private String cargo;

  @NotBlank(message = "La empresa es obligatoria")
  private String empresa;
  
  private String descripcion;

  @NotNull(message = "La fecha de inicio es obligatoria")
  private Date fechaInicio;

  private Date fechaFin;
  
  private Boolean trabajoActual;

  @NotBlank(message = "La ubicación es obligatoria")
  private String ubicacion;

  @NotNull(message = "El ID de aspirante es obligatorio")
  private Integer aspiranteId;
  private String aspiranteNombre;
}
