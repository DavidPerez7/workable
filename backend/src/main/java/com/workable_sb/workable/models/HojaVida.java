package com.workable_sb.workable.models;

import java.time.LocalDate;
import java.util.List;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.workable_sb.workable.models.Embeddable.EstudioData;
import com.workable_sb.workable.models.Embeddable.ExperienciaData;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class HojaVida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 700, message = "Resumen no puede exceder 700 caracteres")
    @Column(length = 700)
    private String resumenProfesional;

    @Size(max = 255)
    @Column(length = 255)
    private String redSocial;

    @Size(max = 255)
    @Column(length = 255)
    private String correoElectronico;

    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    @Column(length = 20)
    private String telefono;

    private LocalDate fechaCreacion;
    private LocalDate fechaActualizacion;

    // Embedidos de estudios y experiencias
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "hoja_vida_estudios",
        joinColumns = @JoinColumn(name = "hoja_vida_id", referencedColumnName = "id"))
    private List<EstudioData> estudios = new java.util.ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "hoja_vida_experiencias",
        joinColumns = @JoinColumn(name = "hoja_vida_id", referencedColumnName = "id"))
    private List<ExperienciaData> experiencias = new java.util.ArrayList<>();

    // Relación con aspirante
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aspirante_id", referencedColumnName = "id")
    private Aspirante aspirante;

    @PrePersist
    protected void onCreate() {
        if (this.fechaCreacion == null) {
            this.fechaCreacion = LocalDate.now();
        }
        this.fechaActualizacion = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDate.now();
    }
}
