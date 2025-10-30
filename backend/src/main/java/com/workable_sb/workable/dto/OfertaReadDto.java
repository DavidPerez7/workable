package com.workable_sb.workable.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfertaReadDto {
  private Integer id;
  private String titulo;
  private String descripcion;
  private String ubicacion;
  private LocalDate fechaPublicacion;
  private LocalDate fechaLimite;
  private Long salario;
  private String estado;

  private Integer modalidadId;
  private String modalidadNombre;

  private Integer tipoContratoId;
  private String tipoContratoNombre;

  private Long empresaId;
  private String empresaNombre;
  
  private Integer reclutadorId;
  private String reclutadorNombre;
}
