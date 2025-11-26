package com.workable_sb.workable.models;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "oferta")
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
		SEGURO_SALUD, SEGURO_VIDA, BONOS, AUXILIO_TRANSPORTE, AUXILIO_ALIMENTACION,
		CAPACITACIONES, TELETRABAJO, HORARIO_FLEXIBLE, VACACIONES_ADICIONALES, GIMNASIO,
		DIAS_COMPENSATORIOS, PLAN_CARRERA, DESCUENTOS_COMERCIALES, AUXILIO_EDUCATIVO, PRIMA_EXTRALEGAL
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
		joinColumns = @JoinColumn(name = "oferta_id", foreignKey = @ForeignKey(name = "FK_ofertaRequisitos_oferta"))
	)
	@Column(name = "requisito", length = 100, nullable = false)
	private Set<String> requisitos = new HashSet<>();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "municipio_id", nullable = false, foreignKey = @ForeignKey(name = "FK_oferta_municipio"))
	private Municipio municipio;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private Modalidad modalidad;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private TipoContrato tipoContrato;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "empresa_id", nullable = false, foreignKey = @ForeignKey(name = "FK_oferta_empresa"))
	private Empresa empresa;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "reclutador_id", foreignKey = @ForeignKey(name = "FK_oferta_reclutador"))
	private Usuario reclutador;

	@ElementCollection(fetch = FetchType.LAZY)
	@CollectionTable(
		name = "oferta_beneficios",
		joinColumns = @JoinColumn(name = "oferta_id", foreignKey = @ForeignKey(name = "FK_ofertaBeneficios_oferta"))
	)
	@Enumerated(EnumType.STRING)
	@Column(name = "beneficio", length = 30, nullable = false)
	private Set<Beneficio> beneficios = new HashSet<>();

	@OneToMany(mappedBy = "oferta", fetch = FetchType.LAZY)
	private Set<Postulacion> postulaciones = new HashSet<>();

	@PrePersist
	public void setFechaPublicacion() {
		if (this.fechaPublicacion == null) {
			this.fechaPublicacion = LocalDate.now();
		}
	}

	@PrePersist
	@PreUpdate
	protected void validateFechas() {
		if (fechaLimite != null && fechaPublicacion != null && fechaLimite.isBefore(fechaPublicacion)) {
			throw new IllegalStateException("La fecha límite debe ser posterior a la fecha de publicación");
		}
	}

}
