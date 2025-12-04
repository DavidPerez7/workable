package com.workable_sb.workable.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "postulacion", uniqueConstraints = {
	@UniqueConstraint(name = "UK_usuario_oferta", columnNames = {"usuario_id", "oferta_id"})
})
public class Postulacion {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private LocalDate fechaCreacion;
	private Boolean isActive = true;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private Estado estado = Estado.PENDIENTE;

	public enum Estado {
	PENDIENTE,
	RECHAZADO,
	ACEPTADO,
	ENTREVISTA_PROGRAMADA
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "oferta_id", nullable = false, referencedColumnName = "id")
	private Oferta oferta;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "usuario_id", nullable = false, referencedColumnName = "id")
	private Usuario usuario;

	@PrePersist
	protected void onCreate(){
	if (this.fechaCreacion == null) {
		this.fechaCreacion = LocalDate.now();
	}
	}
}
