package com.workable_sb.workable.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;

@Getter
@Entity
public class Beneficio {
  @Id
  private Short beneficio_id;
  private String nombre;
    public void setNombre(String nombre) {
      this.nombre = nombre;
    }
}
