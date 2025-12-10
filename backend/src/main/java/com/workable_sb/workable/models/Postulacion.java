package com.workable_sb.workable.models;

import java.time.LocalDate;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.workable_sb.workable.models.Aspirante;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "postulacion", uniqueConstraints = {
	@UniqueConstraint(name = "UK_aspirante_oferta", columnNames = {"aspirante_id", "oferta_id"})
})
public class Postulacion {
	
	private static final Logger log = LoggerFactory.getLogger(Postulacion.class);
	
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

	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "oferta_id", nullable = false, referencedColumnName = "id")
	@JsonIgnoreProperties({"postulaciones", "habilidadesRequeridas", "requisitos", "beneficios", "hibernateLazyInitializer", "handler"})
	private Oferta oferta;

	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "aspirante_id", nullable = false, referencedColumnName = "id")
	@JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
	private Aspirante aspirante;

	@PrePersist
	protected void onCreate() {
		if (this.fechaCreacion == null) {
			this.fechaCreacion = LocalDate.now();
		}
		log.info("Postulación creada: Aspirante {} a Oferta {}", 
				this.aspirante != null ? this.aspirante.getId() : "N/A", 
				this.oferta != null ? this.oferta.getId() : "N/A");
	}
	
	@PreUpdate
	protected void onUpdate() {
		log.info("Postulación actualizada ID {}: nuevo estado {}", this.id, this.estado);
	}
}
