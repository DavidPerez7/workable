package com.workable_sb.workable.models;

import java.time.LocalDate;
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

    @NotBlank(message = "La hora es obligatoria (formato HH:MM)")
    @Pattern(regexp = "^([0-1][0-9]|2[0-3]):[0-5][0-9]$")
    @Column(length = 5)
    private String hora;

    @Size(max = 500)
    @Column(length = 500)
    private String linkMeet;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Estado estado = Estado.PENDIENTE;

    public enum Estado {
        PENDIENTE, CONFIRMADA, ASISTIO, NO_ASISTIO, CANCELADA
    }
}
