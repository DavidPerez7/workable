package com.workable_sb.workable.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;

@Entity
@Getter
public class TipoContrato {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;
  private String nombre;

  public enum EstadoTipoContrato {
    ACTIVO,
    INACTIVO
  }

  @jakarta.persistence.Enumerated(jakarta.persistence.EnumType.STRING)
  @jakarta.persistence.Column(nullable = false)
  private EstadoTipoContrato estado = EstadoTipoContrato.ACTIVO;

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public EstadoTipoContrato getEstado() {
    return estado;
  }

  public void setEstado(EstadoTipoContrato estado) {
    this.estado = estado;
  }
}
