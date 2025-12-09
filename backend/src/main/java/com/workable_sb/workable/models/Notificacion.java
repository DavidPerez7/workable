package com.workable_sb.workable.models;

import java.time.LocalDate;
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
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
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

    // Receptor: puede ser Aspirante O Reclutador, no ambos
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "aspirante_id", referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Aspirante aspirante;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "reclutador_id", referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Reclutador reclutador;

    @PrePersist
    protected void onCreate() {
        if (this.fechaCreacion == null) {
            this.fechaCreacion = LocalDate.now();
        }
        // Validación: debe tener aspirante O reclutador, no ambos ni ninguno
        if ((aspirante == null && reclutador == null) || (aspirante != null && reclutador != null)) {
            throw new IllegalStateException("Notificacion debe tener receptor Aspirante O Reclutador, no ambos ni ninguno");
        }
    }
}

