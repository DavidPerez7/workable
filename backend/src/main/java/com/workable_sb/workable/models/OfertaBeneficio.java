package com.workable_sb.workable.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "oferta_beneficio")
public class OfertaBeneficio {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Short beneficio_id;

  @Column(nullable = false, unique = true)
  private String nombre;
  
  public enum EstadoBeneficio {
    ACTIVO, INACTIVO
  }

  @Enumerated(EnumType.STRING)
  @Column(columnDefinition = "ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO'")
  private EstadoBeneficio estado = EstadoBeneficio.ACTIVO;
}
