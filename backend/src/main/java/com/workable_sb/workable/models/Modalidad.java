package com.workable_sb.workable.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;

@Entity
@Getter
public class Modalidad {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;
  private String nombre;

  public enum EstadoModalidad {
    ACTIVO,
    INACTIVO
  }

  @jakarta.persistence.Enumerated(jakarta.persistence.EnumType.STRING)
  @jakarta.persistence.Column(nullable = false)
  private EstadoModalidad estado = EstadoModalidad.ACTIVO;

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public EstadoModalidad getEstado() {
    return estado;
  }

  public void setEstado(EstadoModalidad estado) {
    this.estado = estado;
  }
}
