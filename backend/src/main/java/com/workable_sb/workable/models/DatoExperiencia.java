package com.workable_sb.workable.models;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Table(name = "dato_experiencia")
public class DatoExperiencia {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer experiencia_id;

  @Column(nullable = false, length = 255)
  private String cargo;

  @Column(nullable = false, length = 255)
  private String empresa;

  @Column(nullable = false)
  private Date fechaInicio;

  @Column(nullable = false)
  private Date fechaFin;

  @Column(nullable = false, length = 255)
  private String ubicacion;

  @ManyToOne(optional = false)
  @JoinColumn(name = "aspirante_id", nullable = false, foreignKey = @ForeignKey(name = "FK_datoExpreiencia_Usuario"))
  private Aspirante aspirante;
}
