package com.workable_sb.workable.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Data;

import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OfertaModalidad {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;
  @Column(nullable = false, unique = true)
  private String nombre;

  public enum EstadoModalidad {
    ACTIVO,
    INACTIVO
  }

  @jakarta.persistence.Enumerated(jakarta.persistence.EnumType.STRING)
  @jakarta.persistence.Column(nullable = false)
  private EstadoModalidad estado = EstadoModalidad.ACTIVO;

}
