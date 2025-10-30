package com.workable_sb.workable.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ValoracionDto {
  @NotBlank(message = "La descripción es obligatoria")
  private String descripcion;

  @NotNull(message = "La puntuación es obligatoria")
  private Float puntuacion;

  @NotNull(message = "El id de empresa es obligatorio")
  private Long empresaId;

  @NotNull(message = "El id de usuario es obligatorio")
  private Integer usuarioId;
}
