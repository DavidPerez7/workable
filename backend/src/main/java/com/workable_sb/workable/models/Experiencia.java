package com.workable_sb.workable.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.FetchType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class Experiencia {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 255)
  private String cargo;

  @Column(nullable = false, length = 255)
  private String empresa;

  @Column(length = 1000)
  private String descripcion;

  @Column(nullable = false)
  private LocalDate fechaInicio;

  private LocalDate fechaFin;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "municipio_id", nullable = false, foreignKey = @ForeignKey(name = "FK_experiencia_municipio"))
  private Municipio municipio;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "FK_datoExperiencia_aspirante"))
  private Usuario usuario;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 10)
  private Estado estado = Estado.ACTIVO;

  public enum Estado {
    ACTIVO, INACTIVO
  }

  @PrePersist
  @PreUpdate
  protected void validateFechas() {
    if (fechaFin != null && fechaInicio != null && fechaFin.isBefore(fechaInicio)) {
      throw new IllegalStateException("La fecha de fin debe ser posterior a la fecha de inicio");
    }
  }
}
