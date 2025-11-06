package com.workable_sb.workable.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class OfertaTipoContrato {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;
  @Column(nullable = false, unique = true)
  private String nombre;

  public enum EstadoTipoContrato {
    ACTIVO,
    INACTIVO
  }

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EstadoTipoContrato estado = EstadoTipoContrato.ACTIVO;

}
