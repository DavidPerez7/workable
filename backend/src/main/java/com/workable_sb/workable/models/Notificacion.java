package com.workable_sb.workable.models;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity

public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String tipo;  // "POSTULACION", "ENTREVISTA", "CAMBIO_ESTADO", "MENSAJE"

    @Column(nullable = false, length = 255)
    private String titulo;

    @Column(nullable = false, length = 500)
    private String mensaje;

    @Column(length = 500)
    private String enlace;  // URL para redirigir (ej: /postulacion/123)

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false)
    private Boolean leida = false;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "FK_notificacion_usuario"))
    private Usuario usuario;

    @PrePersist
    public void setFecha() {
        if (this.fecha == null) {
            this.fecha = LocalDateTime.now();
        }
    }
}
