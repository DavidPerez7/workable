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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.CascadeType;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table(name = "feedback")
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

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "empresa_id", referencedColumnName = "id")
	private Empresa empresa;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "oferta_id", referencedColumnName = "id")
	private Oferta oferta;

	@ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JoinColumn(name = "aspirante_id", nullable = false, referencedColumnName = "id")
	@OnDelete(action = OnDeleteAction.CASCADE)
	private Aspirante aspirante;

	@PrePersist
	@PreUpdate
	private void validateAndSetDefaults() {
		if (this.fechaCreacion == null) {
			this.fechaCreacion = LocalDate.now();
		}
		if (puntuacion != null && (puntuacion < 0.0f || puntuacion > 5.0f)) {
			throw new IllegalStateException("La puntuación debe estar entre 0.0 y 5.0");
		}
		if ((empresa == null && oferta == null) || (empresa != null && oferta != null)) {
			throw new IllegalStateException("Feedback debe tener empresa O oferta, no ambas ni ninguna");
		}
	}
}
