package com.workable_sb.workable.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Beneficio {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Short beneficio_id;
  
  private String nombre;
  
  @Enumerated(EnumType.STRING)
  @Column(columnDefinition = "ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO'")
  private EstadoBeneficio estado = EstadoBeneficio.ACTIVO;
  
  public enum EstadoBeneficio {
    ACTIVO, INACTIVO
  }
}
