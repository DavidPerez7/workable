package com.workable_sb.workable.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaReadDto {
  private Long id;
  private String nombre;
  private String ubicacion;
  private String descripcion;
  private Integer numeroTrabajadores;
  private String correoCorporativo;
  private Float puntuacion;
  private LocalDate fechaCreacion;

  private Integer categoriaId;
  private String categoriaNombre;
  
  private Integer municipioId;
  private String municipioNombre;
}
