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

  @NotNull(message = "La fecha es obligatoria")
  private Date fecha;

  @NotNull(message = "El id de estado es obligatorio")
  private Short estadoId;
  private String estadoNombre;

  @NotNull(message = "La id de oferta es obligatoria")
  private Integer ofertaId;
  private String ofertaTitulo;

  @NotNull(message = "El id de aspirante es obligatorio")
  private Integer aspiranteId;
  private String aspiranteNombre;
}
