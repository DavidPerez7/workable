package com.workable_sb.workable.dto;

import java.util.Date;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class PostulacionDto {
  private Integer id;

  @NotNull
  private Date fech;

  @NotNull(message = "El id de estado es obligatorio")
  private Short estado_Id;
  private String nombreEstado;

  @NotNull(message = "La id de oferta es obligatoria")
  private Integer oferta_Id;
  private String nombreOferta;

  @NotNull(message = "El id de usuario es obligatorio")
  private Integer aspirante_id;
  private String nombreAspirante;
}
