package com.workable_sb.workable.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "empresa_categoria")
@Getter
@Setter
public class EmpresaCategoria {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false, unique = true)
  private String nombre;

  @Column(name = "imagen_url")
  private String imagenUrl;

  @Column(length = 500)
  private String descripcion;

  public enum EstadoCategoria {
    ACTIVO,
    INACTIVO
  }

  @Enumerated(EnumType.STRING)
  @Column(columnDefinition = "ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO'")
  private EstadoCategoria estado = EstadoCategoria.ACTIVO;
}
