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
public class ExperienciaData {
    
    private static final Logger log = LoggerFactory.getLogger(ExperienciaData.class);
    
    @NotBlank(message = "El cargo es obligatorio")
    @Size(min = 2, max = 255, message = "El cargo debe tener entre 2 y 255 caracteres")
    @Column(length = 255)
    private String cargo;

    @NotBlank(message = "La empresa es obligatoria")
    @Size(min = 2, max = 255, message = "El nombre de la empresa debe tener entre 2 y 255 caracteres")
    @Column(length = 255)
    private String empresa;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    @Column(length = 1000)
    private String descripcion;

    @Size(max = 500, message = "La URL del certificado no puede exceder 500 caracteres")
    @Column(length = 500)
    private String certificadoUrl;

    @NotNull(message = "La fecha de inicio es obligatoria")
    @Column
    private LocalDate fechaInicio;

    @Column
    private LocalDate fechaFin;

    @Size(max = 200, message = "El municipio no puede exceder 200 caracteres")
    @Column(length = 200)
    private String municipio;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Estado estado = Estado.ACTIVO;

    public enum Estado {
        ACTIVO, INACTIVO
    }

    @PrePersist
    @PreUpdate
    protected void validateFechas() {
        if (fechaFin != null && fechaInicio != null && fechaFin.isBefore(fechaInicio)) {
            throw new IllegalStateException("La fecha de fin debe ser posterior a la fecha de inicio");
        }
        log.debug("Experiencia validada: {} en {}", cargo, empresa);
    }
}
