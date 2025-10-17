package com.workable_sb.workable.models;

import java.sql.Date;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "info_personal")
public class InfoPersonal {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer infoPersonal_id;

  @Column(nullable = false, length = 100)
  private String ubicacion;

  @Column(nullable = false)
  private Integer telefono;

  @Column(nullable = false)
  private Date fechaNacimiento;

  @Column(nullable = false)
  private String fotoPerfil;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "genero_id", referencedColumnName = "genero_id", foreignKey = @ForeignKey(name = "FK_infoPersonal_Genero"))
  private Genero genero;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "aspirante_id", referencedColumnName = "aspiranteId", foreignKey = @ForeignKey(name = "FK_infoPersonal_Aspirante"))
  private Aspirante aspirante;
}
