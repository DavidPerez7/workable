package com.workable_sb.workable.models;

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

/**
 * Modelo de Habilidad - Representa las habilidades técnicas y profesionales de un aspirante.
 * Las habilidades se pueden crear, listar, actualizar y eliminar.
 * Solo el propietario o un ADMIN pueden modificar las habilidades.
 */
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table(name = "habilidad", indexes = {
    @Index(name = "idx_aspirante_id", columnList = "aspirante_id")
})
public class Habilidad {
    
    private static final Logger log = LoggerFactory.getLogger(Habilidad.class);
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre de la habilidad es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    @Column(nullable = false, length = 100)
    private String nombre;

    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    @Column(length = 500)
    private String descripcion;

    // Nivel de dominio (BASICO, INTERMEDIO, AVANZADO)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private Nivel nivel = Nivel.INTERMEDIO;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aspirante_id", nullable = false, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler", "experiencias", "estudios", "habilidades"})
    private Aspirante aspirante;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Estado estado = Estado.ACTIVO;

    public enum Nivel {
        BASICO, INTERMEDIO, AVANZADO, EXPERTO
    }

    public enum Estado {
        ACTIVO, INACTIVO
    }

    @PrePersist
    @PreUpdate
    protected void validateData() {
        log.debug("Habilidad validada: {} - Nivel: {}", nombre, nivel);
    }
}
