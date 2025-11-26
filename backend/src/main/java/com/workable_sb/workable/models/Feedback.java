package com.workable_sb.workable.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table(name = "feedback", uniqueConstraints = {
	@UniqueConstraint(name = "UK_usuario_empresa", columnNames = {"usuario_id", "empresa_id"})
})
public class Feedback {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 100)
	private String titulo;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String descripcion;

	@Column(nullable = false)
	private Float puntuacion;

	private LocalDate fechaCreacion;
	private Boolean isActive = true;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "empresa_id",nullable = false, foreignKey = @ForeignKey(name = "FK_empresa_feedback"))
	private Empresa empresa;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "FK_usuario_feedback"))
	private Usuario usuario;

	@PrePersist
	@PreUpdate
	private void validateAndSetDefaults() {
		if (this.fechaCreacion == null) {
			this.fechaCreacion = LocalDate.now();
		}
		if (puntuacion != null && (puntuacion < 0.0f || puntuacion > 5.0f)) {
			throw new IllegalStateException("La puntuación debe estar entre 0.0 y 5.0");
		}
	}
}
