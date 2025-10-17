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
  @NotBlank
  private String desc;

  @NotNull
  private Float puntu;

  @NotNull(message = "El id de empresa es obligatorio")
  private Long empresa_id;

  @NotNull(message = "El id de usuario es obligatorio")
  private Integer aspirante_id;
}
