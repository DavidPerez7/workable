package com.workable_sb.workable.models.Embeddable;

import java.time.LocalDate;
import java.time.LocalTime;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CitacionData {

    @NotNull(message = "La fecha de la cita es obligatoria")
    @Column
    private LocalDate fecha;

    @NotNull(message = "La hora es obligatoria")
    @Column
    private LocalTime hora;

    @Size(max = 500)
    @Column(length = 500)
    private String linkMeet;

    @Enumerated(EnumType.STRING)
    @Column(name = "citacion_estado", length = 20)
    private EstadoCitacion estadoCitacion = EstadoCitacion.PENDIENTE;

    public enum EstadoCitacion {
        PENDIENTE, CONFIRMADA, CANCELADA
    }
}
