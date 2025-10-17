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
  private String titu;
  private String desc;
  private String ubi;
  private LocalDate fechaPub;
  private LocalDate fechLim;

  private Integer modal_id;
  private String modalNomb;

  private Integer tipoCon_id;
  private String tipoConNomb;

  private Long emp_id;
  private String empNomb;
}
