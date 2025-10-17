package com.workable_sb.workable.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Getter
@Table(name = "Oferta")
public class Oferta {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer oferta_id;
  
  @Column(nullable = false, length = 255)
  private String titulo;

  @Column(nullable = false, length = 255)
  private String descripcion;

  @Column(nullable = false, length = 100)
  private String ubicacion;
  private LocalDate fechaPublicacion;

  @Column(nullable = false)
  private LocalDate fechaLimite;

  @ManyToOne(optional = false)
  @JoinColumn(name = "modalidad_id", nullable = false,
  foreignKey = @jakarta.persistence.ForeignKey(name = "FK_oferta_modalidad"))
  private Modalidad modalidad;

  @ManyToOne(optional = false)
  @JoinColumn(name = "tipoContrato_id", nullable = false,
  foreignKey = @jakarta.persistence.ForeignKey(name = "FK_oferta_tipoContrato"))
  private TipoContrato tipoContrato;

  @ManyToOne(optional = false)
  @JoinColumn(name = "empresa_id", nullable = false,
  foreignKey = @jakarta.persistence.ForeignKey(name = "FK_oferta_empresa"))
  private Empresa empresa;

}
