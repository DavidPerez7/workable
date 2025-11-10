package com.workable_sb.workable.dto.dato;

import java.sql.Date;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DataEstudioDto {
  private Integer id;

  @NotBlank(message = "El nombre del estudio es obligatorio")
  private String nombre;

  @NotNull(message = "La fecha de inicio es obligatoria")
  private Date fechaInicio;

  private Date fechaFin;
  
  private Boolean enCurso;

  @NotBlank(message = "El certificado es obligatorio")
  private String certificado;

  @NotBlank(message = "La institución es obligatoria")
  private String institucion;

  @NotNull(message = "El id de nivel educativo es obligatorio")
  private Integer nivelEducativoId;
  private String nivelEducativoNombre;

  @NotNull(message = "El id de aspirante es obligatorio")
  private Integer aspiranteId;

  private String estado; // ACTIVO o INACTIVO
}
