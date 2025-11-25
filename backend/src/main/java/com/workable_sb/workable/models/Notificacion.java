package com.workable_sb.workable.models;

import java.time.LocalDate;
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tipo tipo;

    public enum Tipo {
        POSTULACION,
        ENTREVISTA,
        CAMBIO_ESTADO,
        MENSAJE
    }

    @Column(nullable = false, length = 50)
    private String titulo;

    @Column(nullable = false, length = 500)
    private String mensaje;

    @Column(length = 500)
    private String url;  // URL para redirigir (ej: /postulacion/221)

    @Column(nullable = false)
    private LocalDate fechaCreacion;

    @Column(nullable = false)
    private Boolean leida = false;
    private Boolean isActive = true;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "FK_notificacion_usuario"))
    private Usuario usuario;

    @PrePersist
    protected void onCreate() {
        if (this.fechaCreacion == null) {
            this.fechaCreacion = LocalDate.now();
        }
    }
}
