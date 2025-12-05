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
@Data
@Entity
@Table(name = "usuario_habilidad", uniqueConstraints = {
    @UniqueConstraint(name = "UK_usuario_habilidad", columnNames = {"usuario_id", "habilidad_id"})
})
public class UsuarioHabilidad {
    
    private static final Logger log = LoggerFactory.getLogger(UsuarioHabilidad.class);
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false, cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id", nullable = false, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "habilidad_id", nullable = false, referencedColumnName = "id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Habilidad habilidad;

    @NotNull(message = "El nivel de dominio es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NivelDominio nivel;

    public enum NivelDominio {
        BASICO,
        INTERMEDIO,
        AVANZADO,
        EXPERTO
    }

    @PastOrPresent(message = "La fecha de adquisición no puede ser futura")
    private LocalDate fechaAdquisicion;

    @Column(nullable = false)
    private Boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        if (this.fechaAdquisicion == null) {
            this.fechaAdquisicion = LocalDate.now();
        }
        log.info("UsuarioHabilidad creada: Usuario {} - Habilidad {}", 
                this.usuario != null ? this.usuario.getId() : "N/A", 
                this.habilidad != null ? this.habilidad.getId() : "N/A");
    }
}
