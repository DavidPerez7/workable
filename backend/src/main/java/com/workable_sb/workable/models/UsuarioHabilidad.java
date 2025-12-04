package com.workable_sb.workable.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "usuario_habilidad", uniqueConstraints = {
    @UniqueConstraint(name = "UK_usuario_habilidad", columnNames = {"usuario_id", "habilidad_id"})
})
public class UsuarioHabilidad {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false, referencedColumnName = "id")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "habilidad_id", nullable = false, referencedColumnName = "id")
    private Habilidad habilidad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NivelDominio nivel;

    public enum NivelDominio {
        BASICO,
        INTERMEDIO,
        AVANZADO,
        EXPERTO
    }

    private LocalDate fechaAdquisicion;

    @Column(nullable = false)
    private Boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        if (this.fechaAdquisicion == null) {
            this.fechaAdquisicion = LocalDate.now();
        }
    }
}
