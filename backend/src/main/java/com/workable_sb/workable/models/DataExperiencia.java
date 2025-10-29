package com.workable_sb.workable.models;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class DataExperiencia {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false, length = 255)
  private String cargo;

  @Column(nullable = false, length = 255)
  private String empresa;

  @Column(length = 1000)
  private String descripcion;  // Descripción de funciones/logros

  @Column(nullable = false)
  private Date fechaInicio;

  private Date fechaFin;  // null si es trabajo actual

  @Column(nullable = false)
  private Boolean trabajoActual = false;

  @Column(nullable = false, length = 255)
  private String ubicacion;

  @ManyToOne
  @JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "FK_datoExperiencia_aspirante"))
  private Usuario usuario;
}
