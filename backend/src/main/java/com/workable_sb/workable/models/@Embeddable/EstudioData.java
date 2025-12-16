package com.workable_sb.workable.models;

import java.time.LocalDate;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Data
public class EstudioData {
    
    private static final Logger log = LoggerFactory.getLogger(EstudioData.class);
    
    @NotBlank(message = "El título es obligatorio")
    @Size(min = 2, max = 255, message = "El título debe tener entre 2 y 255 caracteres")
    @Column(length = 255)
    private String titulo;

    @NotNull(message = "La fecha de inicio es obligatoria")
    @Column
    private LocalDate fechaInicio;
    
    @Column
    private LocalDate fechaFin;

    @Column
    private Boolean enCurso = false;

    @NotBlank(message = "La institución es obligatoria")
    @Size(min = 2, max = 255, message = "La institución debe tener entre 2 y 255 caracteres")
    @Column(length = 255)
    private String institucion;

    @Size(max = 500, message = "La URL del certificado no puede exceder 500 caracteres")
    @Column(length = 500)
    private String certificadoUrl;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    @Column(length = 1000)
    private String descripcion;

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
    @Column(length = 30)
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
