package com.workable_sb.workable.models;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Citacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "postulacion_id", nullable = false, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Postulacion postulacion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reclutador_id", nullable = true, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Reclutador reclutador;

    @Column(nullable = false)
    private LocalDate fechaCitacion;

    @Column(nullable = false, length = 50)
    private String hora; // HH:MM

    @Column(nullable = false, length = 1000)
    private String linkMeet; // Link de Google Meet

    @Column(length = 1000)
    private String detallesCitacion; // Detalles adicionales

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado; // PENDIENTE, CONFIRMADA, ASISTIO, NO_ASISTIO, CANCELADA

    public enum Estado {
        PENDIENTE,
        CONFIRMADA,
        ASISTIO,
        NO_ASISTIO,
        CANCELADA
    }

    @Column(nullable = false)
    private LocalDateTime fechaEnvio;

    // Se reutiliza la columna existente para marcar si se notificó al aspirante
    @Column(name = "correo_enviado", nullable = false)
    private Boolean mensajeEnviado;

    @Column(length = 500)
    private String observaciones;

    private LocalDateTime fechaCreacion;
    private Boolean isActive;

    @PrePersist
    protected void onCreate() {
        if (this.fechaCreacion == null) {
            this.fechaCreacion = LocalDateTime.now();
        }
        if (this.isActive == null) {
            this.isActive = true;
        }
        if (this.estado == null) {
            this.estado = Estado.PENDIENTE;
        }
        if (this.mensajeEnviado == null) {
            this.mensajeEnviado = false;
        }
    }
}
