package com.workable_sb.workable.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.ForeignKey;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Municipio {
  @Id
  private Integer municipio_id;

  @Column(nullable = false, length = 50)
  private String nombre;

  @ManyToOne(optional = false)
  @JoinColumn(name = "departamento_id", nullable = false, foreignKey = @ForeignKey(name = "FK_municipio_departamento"))
  private Departamento departamento;

}