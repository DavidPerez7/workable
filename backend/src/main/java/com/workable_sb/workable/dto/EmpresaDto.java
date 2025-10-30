package com.workable_sb.workable.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaDto {
  @NotBlank(message = "El nombre es obligatorio")
  private String nombre;

  @NotBlank(message = "La ubicación es obligatoria")
  private String ubicacion;

  @NotBlank(message = "La descripción es obligatoria")
  private String descripcion;

  @NotNull(message = "El número de trabajadores es obligatorio")
  private Integer numeroTrabajadores;

  @NotBlank(message = "El correo corporativo es obligatorio")
  @Email(message = "El correo corporativo debe ser válido")
  private String correoCorporativo;

  @NotNull(message = "La categoría es obligatoria")
  private Integer categoriaId;

  @NotNull(message = "El municipio es obligatorio")
  private Integer municipioId;
}
