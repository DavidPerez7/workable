package com.workable_sb.workable.models;

import jakarta.persistence.Column;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaCategoria {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false, unique = true)
  private String nombre;

  private String imagenUrl;
  private String descripcion;

  private enum estadoCatg {
    ACTIVO,
    INACTIVO
  };

  @Enumerated(EnumType.STRING)
  private estadoCatg estado = estadoCatg.ACTIVO;
}
