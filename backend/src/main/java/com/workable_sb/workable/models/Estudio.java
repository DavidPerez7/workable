package com.workable_sb.workable.models;

import java.time.LocalDate;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table(name = "estudio")
public class Estudio {
    
    private static final Logger log = LoggerFactory.getLogger(Estudio.class);
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título es obligatorio")
    @Size(min = 2, max = 255, message = "El título debe tener entre 2 y 255 caracteres")
    @Column(nullable = false, length = 255)
    private String titulo;

    @NotNull(message = "La fecha de inicio es obligatoria")
    @PastOrPresent(message = "La fecha de inicio no puede ser futura")
    @Column(nullable = false)
    private LocalDate fechaInicio;
    
    private LocalDate fechaFin;

    @Column(nullable = false)
    private Boolean enCurso = false;

    @NotBlank(message = "La institución es obligatoria")
    @Size(min = 2, max = 255, message = "La institución debe tener entre 2 y 255 caracteres")
    @Column(nullable = false, length = 255)
    private String institucion;

    @Size(max = 500, message = "La URL del certificado no puede exceder 500 caracteres")
    @Column(length = 500)
    private String certificadoUrl;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    @Column(length = 1000)
    private String descripcion;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "municipio_id", nullable = true, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Municipio municipio;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Modalidad modalidad;

    public enum Modalidad {
        PRESENCIAL,
        VIRTUAL,
        HIBRIDA
    }

    @NotNull(message = "El nivel educativo es obligatorio")
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

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "aspirante_id", nullable = false, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private Aspirante aspirante;

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
        log.debug("Estudio validado: {} en {}", titulo, institucion);
    }
}
