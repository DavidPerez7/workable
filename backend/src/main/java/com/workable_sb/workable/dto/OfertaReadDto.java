package com.workable_sb.workable.dto;

import java.time.LocalDate;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OfertaReadDto {
  private Integer id;
  private String titu;
  private String desc;
  private String ubi;
  private String requisitos;
  private String salario;
  private String jornada;
  private String beneficios;
  private String responsabilidades;
  private String contacto;
  private LocalDate fechaPub;
  private LocalDate fechLim;

  private Integer modal_id;
  private String modalNomb;

  private Integer tipoCon_id;
  private String tipoConNomb;

  private Long emp_id;
  private String empNomb;

  // Constructor completo
  public OfertaReadDto(Integer id, String titu, String desc, String ubi, 
                       String requisitos, String salario, String jornada,
                       String beneficios, String responsabilidades, String contacto,
                       LocalDate fechaPub, LocalDate fechLim,
                       Integer modal_id, String modalNomb,
                       Integer tipoCon_id, String tipoConNomb,
                       Long emp_id, String empNomb) {
    this.id = id;
    this.titu = titu;
    this.desc = desc;
    this.ubi = ubi;
    this.requisitos = requisitos;
    this.salario = salario;
    this.jornada = jornada;
    this.beneficios = beneficios;
    this.responsabilidades = responsabilidades;
    this.contacto = contacto;
    this.fechaPub = fechaPub;
    this.fechLim = fechLim;
    this.modal_id = modal_id;
    this.modalNomb = modalNomb;
    this.tipoCon_id = tipoCon_id;
    this.tipoConNomb = tipoConNomb;
    this.emp_id = emp_id;
    this.empNomb = empNomb;
  }
}
