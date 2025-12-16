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
public class CitacionData {
    
    private static final Logger log = LoggerFactory.getLogger(CitacionData.class);

    @NotNull(message = "La fecha de la cita es obligatoria")
    @FutureOrPresent(message = "La fecha de la cita debe ser en el presente o futuro")
    @Column
    private LocalDate fecha;

    @NotBlank(message = "La hora es obligatoria (formato HH:MM)")
    @Pattern(regexp = "^([0-1][0-9]|2[0-3]):[0-5][0-9]$", 
             message = "La hora debe estar en formato HH:MM (24 horas)")
    @Column(length = 5)
    private String hora;

    @Size(max = 500, message = "El link de Meet no puede exceder 500 caracteres")
    @Column(length = 500)
    private String linkMeet;

    @Size(max = 1000, message = "Los detalles no pueden exceder 1000 caracteres")
    @Column(length = 1000)
    private String detalles;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @NotNull(message = "El estado de la cita es obligatorio")
    private Estado estado = Estado.PENDIENTE;

    public enum Estado {
        PENDIENTE,      // Cita programada pero no confirmada
        CONFIRMADA,     // Confirmada por el aspirante
        ASISTIO,        // Aspirante asistió
        NO_ASISTIO,     // Aspirante no asistió
        CANCELADA       // Cita fue cancelada
    }

    @PrePersist
    @PreUpdate
    protected void validateCitacion() {
        if (fecha != null && fecha.isBefore(LocalDate.now())) {
            log.warn("Intento de crear cita con fecha pasada: {}", fecha);
            // Nota: En producción, considerar throw IllegalStateException
            // Por ahora se permite para casos administrativos
        }
        log.debug("Citación validada: {} a las {}", fecha, hora);
    }
}
