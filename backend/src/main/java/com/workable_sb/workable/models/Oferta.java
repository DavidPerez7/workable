package com.workable_sb.workable.models;

import java.time.LocalDate;
import java.util.Set;
import java.util.HashSet;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "oferta")
public class Oferta {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	//atributos obligatorios
	@NotBlank(message = "El título es obligatorio")
	@Column(nullable = false, length = 255)
	private String titulo;

	@NotBlank(message = "La descripción es obligatoria")
	@Column(nullable = false, columnDefinition = "TEXT")
	private String descripcion;

	@NotNull(message = "La fecha límite es obligatoria")
	@Column(nullable = false)
	private LocalDate fechaLimite;
	
	@NotNull(message = "El salario es obligatorio")
	@Column(nullable = false)
	private Long salario;

	@NotNull(message = "El número de vacantes es obligatorio")
	@Column(nullable = false)
	private Integer numeroVacantes;

	@NotNull(message = "El nivel de experiencia es obligatorio")
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private NivelExperiencia nivelExperiencia;

	@NotBlank(message = "Los requisitos son obligatorios")
	@Column(nullable = false, length = 500)
	private String requisitos;

	@NotNull(message = "El municipio es obligatorio")
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "municipio_id", nullable = false, referencedColumnName = "id")
	@OnDelete(action = OnDeleteAction.RESTRICT)
	private Municipio municipio;

	@NotEmpty(message = "La modalidad es obligatoria")
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private Modalidad modalidad;

	@NotEmpty(message = "El tipo de contrato es obligatorio")
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private TipoContrato tipoContrato;

	//beneficios adicionales
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private EstadoOferta estado;

	private Float puntuacion = 0.0f;

	private LocalDate fechaPublicacion;

	//relaciones
	@OneToMany(mappedBy = "oferta", fetch = FetchType.LAZY)
	@com.fasterxml.jackson.annotation.JsonIgnore
	private Set<Postulacion> postulaciones = new HashSet<>();

	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "empresa_id", nullable = false, referencedColumnName = "id")
	private Empresa empresa;

	public enum EstadoOferta {
		ACTIVA, INACTIVA, FINALIZADA
	}
	
	public enum Modalidad {
		PRESENCIAL, REMOTO, HIBRIDO
	}
	
	public enum TipoContrato {
		TIEMPO_COMPLETO, MEDIO_TIEMPO, TEMPORAL, PRESTACION_SERVICIOS, PRACTICAS
	}
	
	public enum NivelExperiencia {
		SIN_EXPERIENCIA, BASICO, INTERMEDIO, AVANZADO, EXPERTO
	}

	@PrePersist
	protected void onCreate() {
		if (this.fechaPublicacion == null) {
			this.fechaPublicacion = LocalDate.now();
		}
		if (this.estado == null) {
			this.estado = EstadoOferta.ACTIVA;
		}
		validateFechas();
	}

	@PreUpdate
	protected void onUpdate() {
		validateFechas();
	}

	private void validateFechas() {
		if (fechaLimite != null && fechaPublicacion != null && fechaLimite.isBefore(fechaPublicacion)) {
			throw new IllegalStateException("La fecha límite debe ser posterior a la fecha de publicación");
		}
	}

}
