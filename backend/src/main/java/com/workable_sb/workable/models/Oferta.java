package com.workable_sb.workable.models;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Getter
public class Oferta {
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
	private Modalidad modalidad;

	@ManyToOne(optional = false)
	@JoinColumn(name = "tipoContrato_id", nullable = false, foreignKey = @ForeignKey(name = "FK_oferta_tipoContrato"))
	private TipoContrato tipoContrato;

	@ManyToOne(optional = false)
	@JoinColumn(name = "empresa_id", nullable = false, foreignKey = @ForeignKey(name = "FK_oferta_empresa"))
	private Empresa empresa;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "oferta_beneficio", 
	joinColumns = @JoinColumn(name = "ofertaid", foreignKey = @ForeignKey(name = "FK_ofertaBeneficio_oferta")),
	inverseJoinColumns = @JoinColumn(name = "beneficioid", foreignKey = @ForeignKey(name = "FK_ofertaBeneficio_beneficio")))
	private Set<Beneficio> beneficios = new HashSet<>();

	@OneToMany(mappedBy = "oferta", fetch = FetchType.LAZY)
	private Set<Postulacion> postulaciones = new HashSet<>();

	@PrePersist
	public void setFechaPublicacion() {
		if (this.fechaPublicacion == null) {
			this.fechaPublicacion = LocalDate.now();
		}
	}

}
