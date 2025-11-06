package com.workable_sb.workable.dto.empresa;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaDto {
  // NIT de la empresa (obligatorio al crear)
  @NotNull(message = "El NIT es obligatorio")
  private Long nitId;
  
  @NotBlank(message = "El nombre es obligatorio")
  private String nombre;

  @NotBlank(message = "La descripción es obligatoria")
  private String descripcion;

  @NotNull(message = "El número de trabajadores es obligatorio")
  private Integer numeroTrabajadores;

  @NotNull(message = "La categoría es obligatoria")
  private Integer categoriaId;
  
  @NotNull(message = "El municipio es obligatorio")
  private Integer municipioId;
  
  // Campos de solo lectura (null al crear, llenados por backend al leer)
  private String categoriaNombre;
  private String municipioNombre;
  private Float puntuacion;
  private LocalDate fechaUnion;
}
