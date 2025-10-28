package com.workable_sb.workable.models;


import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@Entity
@Data
@Table(name = "valoracion")
public class Valoracion {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(nullable = false, length = 255)
	private String descripcion;

	@Column(nullable = false)
	private Float puntuacion;
	private LocalDate fecha_valoracion;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "empresa_id",nullable = false, foreignKey = @ForeignKey(name = "FK_empresa_valoracion"))
	private Empresa empresa;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "FK_usuario_valoracion"))
	private Usuario usuario;

	@PrePersist
	private void setFecha_valoracion() {
		if (this.fecha_valoracion == null) {
			this.fecha_valoracion = LocalDate.now();
		}
	}
	
}
