package com.workable_sb.workable.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class Modalidad {
  @Id
  private Integer id;
  private String nombre;
    public void setNombre(String nombre) {
      this.nombre = nombre;
    }
}
