package com.workable_sb.workable.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Table (name = "tipo_contrato")
@Getter
public class TipoContrato {
  @Id
  private Integer tipo_contrato_id;

  @Column(length = 50)
  private String nombre;
}
