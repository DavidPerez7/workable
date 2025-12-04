package com.workable_sb.workable.models;

import java.time.LocalDate;
import jakarta.persistence.CascadeType;
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
import jakarta.persistence.PreUpdate;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class Estudio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String titulo;

    @Column(nullable = false)
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    @Column(nullable = false)
    private Boolean enCurso = false;

    @Column(nullable = false , length = 255)
    private String institucion;

    @Column(length = 500)
    private String certificadoUrl;

    @Column(length = 1000)
    private String descripcion;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "municipio_id", nullable = true, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Municipio municipio;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Modalidad modalidad;

    public enum Modalidad {
        PRESENCIAL,
        VIRTUAL,
        HIBRIDA
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private NivelEducativo nivelEducativo;

    public enum NivelEducativo {
        PRIMARIA,
        BACHILLERATO,
        TECNICO,
        TECNOLOGO,
        LICENCIATURA,
        UNIVERSITARIO,
        ESPECIALIZACION,
        MAESTRIA,
        DOCTORADO
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false, referencedColumnName = "id")
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoEstudio estadoEstudio = EstadoEstudio.ACTIVO;

    public enum EstadoEstudio {
        ACTIVO,
        INACTIVO
    }

    @PrePersist
    @PreUpdate
    protected void validateDates() {
        if (enCurso && fechaFin != null) {
            throw new IllegalStateException("Un estudio en curso no puede tener fecha de fin");
        }
        if (fechaFin != null && fechaFin.isBefore(fechaInicio)) {
            throw new IllegalStateException("La fecha de fin debe ser posterior a la fecha de inicio");
        }
    }
}
