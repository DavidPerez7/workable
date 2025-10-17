package com.workable_sb.workable.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Table(name = "tipo_documento")
@Getter
public class TipDocumento {
  @Id
  private Integer tipoDocumento_id;

  @Column(length = 20)
  private String nombre;

  private Integer numeroDocumento;
}
