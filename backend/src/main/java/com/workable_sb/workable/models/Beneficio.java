package com.workable_sb.workable.models;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Getter
@Entity
@Table(name = "beneficio")
public class Beneficio {
  @Id
  private Short beneficio_id;

  @Column(nullable = false, length = 255)
  private String nombre;
}
