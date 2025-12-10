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
@Table(name = "experiencia")
public class Experiencia {
    
    private static final Logger log = LoggerFactory.getLogger(Experiencia.class);
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El cargo es obligatorio")
    @Size(min = 2, max = 255, message = "El cargo debe tener entre 2 y 255 caracteres")
    @Column(nullable = false, length = 255)
    private String cargo;

    @NotBlank(message = "La empresa es obligatoria")
    @Size(min = 2, max = 255, message = "El nombre de la empresa debe tener entre 2 y 255 caracteres")
    @Column(nullable = false, length = 255)
    private String empresa;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    @Column(length = 1000)
    private String descripcion;

    @NotNull(message = "La fecha de inicio es obligatoria")
    @PastOrPresent(message = "La fecha de inicio no puede ser futura")
    @Column(nullable = false)
    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "municipio_id", nullable = true, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Municipio municipio;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aspirante_id", nullable = false, referencedColumnName = "id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private Aspirante aspirante;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
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
