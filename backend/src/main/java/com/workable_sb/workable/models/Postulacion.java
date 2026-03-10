package com.workable_sb.workable.models;

import java.time.LocalDate;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.workable_sb.workable.models.Embeddable.CitacionData;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "postulacion", uniqueConstraints = { @UniqueConstraint(name = "UK_aspirante_oferta", columnNames = {"aspirante_id", "oferta_id"})}) // Garantiza unicidad conjunta (aspirante + oferta)
public class Postulacion {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "El estado de la postulación es obligatorio")
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private Estado estado = Estado.PENDIENTE;

	@NotNull(message = "La oferta es obligatoria")
	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "oferta_id", nullable = false, referencedColumnName = "id")
	@JsonIgnoreProperties({"postulaciones", "requisitos", "hibernateLazyInitializer", "handler"}) // Evita bucle infinito al serializar y campos innecesarios
	private Oferta oferta;

	@NotNull(message = "El aspirante es obligatorio")
	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "aspirante_id", nullable = false, referencedColumnName = "id")
	@JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
	private Aspirante aspirante;

	@Embedded
	private CitacionData citacion; // Información de citación para entrevista (fecha, hora, link y estado)

	private LocalDate fechaCreacion;

	public enum Estado {
		PENDIENTE,
		RECHAZADO,
		ACEPTADO,
		ENTREVISTA_PROGRAMADA
	}


	@PrePersist
	protected void onCreate() {
		if (this.fechaCreacion == null) {
			this.fechaCreacion = LocalDate.now();
		}
	}
}
