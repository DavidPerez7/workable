package com.workable_sb.workable.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AspiranteReadDto {

  private Integer id;

  private String nom;

  private String ape;

  private String corr;

  private String ubi;

  private Long tel;

  private Date feNa;

    private Integer numerDoc;

  private Integer tipDoc_id;
  private String nombreTipDoc;

  private Integer munici_id;
  private String nombreMunicipio;

  private Short  genero_id;
  private String nombreGenero;
}
