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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.ForeignKey;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class Feedback {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(nullable = false, length = 255)
	private String descripcion;

	@Column(nullable = false)
	private Float puntuacion;
	private LocalDate fechaCreacion;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "empresa_id",nullable = false, foreignKey = @ForeignKey(name = "FK_empresa_feedback"))
	private Empresa empresa;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "FK_usuario_feedback"))
	private Usuario usuario;

	@PrePersist
	private void setCreationDate() {
		if (this.fechaCreacion == null) {
			this.fechaCreacion = LocalDate.now();
		}
	}
}
