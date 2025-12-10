package com.workable_sb.workable.models;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Oferta {
	
	public enum EstadoOferta {
		ABIERTA, CERRADA, PAUSADA
	}
	
	public enum Modalidad {
		PRESENCIAL, REMOTO, HIBRIDO
	}
	
	public enum TipoContrato {
		TIEMPO_COMPLETO, MEDIO_TIEMPO, TEMPORAL, PRESTACION_SERVICIOS, PRACTICAS
	}
	
	public enum Beneficio {
		SEGUROSALUD, SEGUROVIDA, BONOS, AUXILIOTRANSPORTE, AUXILIOALIMENTACION,
		CAPACITACIONES, TELETRABAJO, HORARIOFLEXIBLE, VACACIONESADICIONALES, GIMNASIO,
		DIASCOMPENSATORIOS, PLANCARRERA, DESCUENTOSCOMERCIALESAUX, AUXILIOEDUCATIVO, PRIMAEXTRALEGAL
	}
	
	public enum NivelExperiencia {
		SIN_EXPERIENCIA, BASICO, INTERMEDIO, AVANZADO, EXPERTO
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 255)
	private String titulo;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String descripcion;

	@Column(nullable = false)
	private LocalDate fechaLimite;
	
	private LocalDate fechaPublicacion;

	@Column(nullable = false)
	private Long salario;

	@Column(nullable = false)
	private Integer numeroVacantes = 1;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private NivelExperiencia nivelExperiencia;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20, columnDefinition = "VARCHAR(20) DEFAULT 'ABIERTA'")
	private EstadoOferta estado = EstadoOferta.ABIERTA;

	@ElementCollection(fetch = FetchType.LAZY)
	@CollectionTable(
		name = "oferta_requisitos",
		joinColumns = @JoinColumn(name = "oferta_id", referencedColumnName = "id")
	)
	@Column(name = "requisito", length = 100, nullable = false)
	private Set<String> requisitos = new HashSet<>();

	@ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
	@JoinColumn(name = "municipio_id", nullable = true, referencedColumnName = "id")
	@OnDelete(action = OnDeleteAction.SET_NULL)
	private Municipio municipio;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private Modalidad modalidad;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private TipoContrato tipoContrato;

	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "empresa_id", nullable = false, referencedColumnName = "id")
	@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"reclutadores", "reclutadorOwner"})
	private Empresa empresa;

	@ElementCollection(fetch = FetchType.LAZY)
	@CollectionTable(
		name = "oferta_beneficios",
		joinColumns = @JoinColumn(name = "oferta_id", referencedColumnName = "id")
	)
	@Enumerated(EnumType.STRING)
	@Column(name = "beneficio", length = 30, nullable = false)
	private Set<Beneficio> beneficios = new HashSet<>();

	@ElementCollection(fetch = FetchType.LAZY)
	@CollectionTable(
		name = "oferta_habilidades_requeridas",
		joinColumns = @JoinColumn(name = "oferta_id", referencedColumnName = "id")
	)
	@Enumerated(EnumType.STRING)
	@Column(name = "habilidad", length = 30, nullable = false)
	private Set<Aspirante.HabilidadEnum> habilidadesRequeridas = new HashSet<>();


	@OneToMany(mappedBy = "oferta", fetch = FetchType.LAZY)
	@com.fasterxml.jackson.annotation.JsonIgnore
	private Set<Postulacion> postulaciones = new HashSet<>();

	private Float puntuacion = 0.0f;

	@PrePersist
	protected void onCreate() {
		if (this.fechaPublicacion == null) {
			this.fechaPublicacion = LocalDate.now();
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
