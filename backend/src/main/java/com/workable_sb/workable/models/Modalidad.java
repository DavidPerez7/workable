package com.workable_sb.workable.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Getter
@Table(name = "modalidad")
public class Modalidad {
  @Id
  private Integer modalidad_id;

  @Column(nullable = false, length = 255)
  private String nombre;
}
