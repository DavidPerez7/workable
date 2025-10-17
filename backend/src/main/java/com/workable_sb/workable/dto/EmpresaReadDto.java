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
  private String nom;
  private String ubi;
  private String desc;
  private Integer numTrab;
  private String correoCorp;
  private float punt;
  private LocalDate fechaCrea;

  private Integer cat_id;
  private String nomCat;
  private Integer munici_id;
  private String nomMunici;
}
