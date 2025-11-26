package com.workable_sb.workable.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Data
@Entity
public class Postulacion {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private LocalDate fechaCreacion;
	private Boolean isActive = true;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Estado estado = Estado.PENDIENTE;

	public enum Estado {
	PENDIENTE,
	RECHAZADO,
	ACEPTADO,
	ENTREVISTA_PROGRAMADA
	}

	@ManyToOne(optional = false)
	@JoinColumn(name = "oferta_id", nullable = false, foreignKey = @ForeignKey(name = "FK_oferta_postulacion"))
	private Oferta oferta;

	@ManyToOne(optional = false)
	@JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "FK_usuario_postulacion"))
	private Usuario usuario;

	@PrePersist
	protected void onCreate(){
	if (this.fechaCreacion == null) {
		this.fechaCreacion = LocalDate.now();
	}
	}
}
