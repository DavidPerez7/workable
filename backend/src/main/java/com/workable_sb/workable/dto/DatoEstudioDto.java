package com.workable_sb.workable.dto;

import java.sql.Date;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DatoEstudioDto {
  private Integer Est_id;

  @NotNull
  private String nom;

  @NotNull
  private Date fechaIn;

  private Date fechaFi;

  @NotNull
  private String cert;

  @NotNull
  private String inst;

  @NotNull(message = "el id de nuvel educativo es obligatorio")
  private Integer nivEdu_id;
  private String nivEdu_nom;

  @NotNull(message = "el id de usuario es obligatorio")
  private Integer asp_id;
}
