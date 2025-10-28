package com.workable_sb.workable.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class TipoDocumento {
  @Id
  private Integer id;
  private String nombre;
}
