package com.workable_sb.workable.models;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.ForeignKey;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "postulacion")
public class Postulacion {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;
  private LocalDate fechaPostulacion;

  @ManyToOne(optional = false)
  @JoinColumn(name = "estado_id", nullable = false, foreignKey = @ForeignKey(name = "FK_estado_postulacion"))
  private PostulacionEstado postulacionEstado;

  @ManyToOne(optional = false)
  @JoinColumn(name = "oferta_id", nullable = false, foreignKey = @ForeignKey(name = "FK_oferta_postulacion"))
  private Oferta oferta;

  @ManyToOne(optional = false)
  @JoinColumn(name = "aspirante_id", nullable = false, foreignKey = @ForeignKey(name = "FK_usuario_postulacion"))
  private Usuario usuario;

  @PrePersist
  public void setFechaPostulacion() {
    if (this.fechaPostulacion == null) {
      this.fechaPostulacion = LocalDate.now();
    }
  }
}
