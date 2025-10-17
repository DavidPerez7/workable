package com.workable_sb.workable.models;

import java.sql.Blob;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Getter
@Table (name = "categoria")
public class Categoria {
  @Id
  private Integer categoria_id;

  @Column(nullable = false, length = 255)
  private String nombre;

  @Column(nullable = false)
  private Blob imagen;

  @Column(nullable = false, length = 255)
  private String descripcion;
}
