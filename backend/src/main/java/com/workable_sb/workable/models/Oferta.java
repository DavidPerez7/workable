package com.workable_sb.workable.models;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Getter
@Setter
@Table(name = "oferta")
public class Oferta {
	
	public enum EstadoOferta {
		ABIERTA, CERRADA, PAUSADA
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(nullable = false, length = 255)
	private String titulo;

	@Column(nullable = false, length = 255)
	private String descripcion;

	@Column(nullable = false, length = 100)
	private String ubicacion;

	@Column(nullable = false)
	private LocalDate fechaLimite;
	
	private LocalDate fechaPublicacion;

	@Column(nullable = false)
	private Long salario;

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

	@ManyToOne(optional = false)
	@JoinColumn(name = "modalidad_id", nullable = false, foreignKey = @ForeignKey(name = "FK_oferta_modalidad"))
	private OfertaModalidad modalidad;

	@ManyToOne(optional = false)
	@JoinColumn(name = "tipoContrato_id", nullable = false, foreignKey = @ForeignKey(name = "FK_oferta_tipoContrato"))
	private OfertaTipoContrato tipoContrato;

	@ManyToOne(optional = false)
	@JoinColumn(name = "empresa_id", nullable = false, foreignKey = @ForeignKey(name = "FK_oferta_empresa"))
	private Empresa empresa;

	@ManyToOne
	@JoinColumn(name = "reclutador_id", foreignKey = @ForeignKey(name = "FK_oferta_reclutador"))
	private UsrReclutador reclutador;  // Quién creó la oferta (opcional para auditoría)

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "oferta_tiene_beneficio", 
	joinColumns = @JoinColumn(name = "ofertaid", foreignKey = @ForeignKey(name = "FK_ofertaTieneBeneficio_oferta")),
	inverseJoinColumns = @JoinColumn(name = "beneficioid", foreignKey = @ForeignKey(name = "FK_ofertaTieneBeneficio_beneficio")))
	private Set<OfertaBeneficio> beneficios = new HashSet<>();

	@OneToMany(mappedBy = "oferta", fetch = FetchType.LAZY)
	private Set<Postulacion> postulaciones = new HashSet<>();

	@PrePersist
	public void setFechaPublicacion() {
		if (this.fechaPublicacion == null) {
			this.fechaPublicacion = LocalDate.now();
		}
	}

}
