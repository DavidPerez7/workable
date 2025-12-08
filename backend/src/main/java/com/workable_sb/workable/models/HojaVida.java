package com.workable_sb.workable.models;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.workable_sb.workable.models.Aspirante;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "hoja_vida")
public class HojaVida {
    
    private static final Logger log = LoggerFactory.getLogger(HojaVida.class);
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título es obligatorio")
    @Size(min = 3, max = 100, message = "El título debe tener entre 3 y 100 caracteres")
    @Column(nullable = false, length = 100)
    private String titulo;

    @Size(max = 1000, message = "El resumen profesional no puede exceder 1000 caracteres")
    @Column(length = 1000)
    private String resumenProfesional;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false)
    private Boolean esPublica = false;

    private LocalDate fechaCreacion;
    private LocalDate fechaActualizacion;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "aspirante_id", nullable = false, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private Aspirante aspirante;

    @Size(max = 100, message = "El teléfono adicional no puede exceder 100 caracteres")
    @Column(length = 100)
    private String telefonoAdicional;

    @Size(max = 255, message = "El LinkedIn no puede exceder 255 caracteres")
    @Column(length = 255)
    private String linkedin;

    @Size(max = 255, message = "El portfolio no puede exceder 255 caracteres")
    @Column(length = 255)
    private String portfolio;

    @Size(max = 255, message = "El GitHub no puede exceder 255 caracteres")
    @Column(length = 255)
    private String github;

    @Size(max = 500, message = "El objetivo profesional no puede exceder 500 caracteres")
    @Column(length = 500)
    private String objetivoProfesional;

    @Size(max = 100, message = "La disponibilidad no puede exceder 100 caracteres")
    @Column(length = 100)
    private String disponibilidad;

    @Min(value = 0, message = "El salario esperado no puede ser negativo")
    private Long salarioEsperado;

    @Size(max = 50, message = "El nivel de experiencia no puede exceder 50 caracteres")
    @Column(length = 50)
    private String nivelExperiencia;

    @Size(max = 500, message = "Los idiomas no pueden exceder 500 caracteres")
    @Column(length = 500)
    private String idiomas;

    @Size(max = 1000, message = "Las certificaciones no pueden exceder 1000 caracteres")
    @Column(length = 1000)
    private String certificaciones;

    @Size(max = 1000, message = "Las referencias no pueden exceder 1000 caracteres")
    @Column(length = 1000)
    private String referencias;

    @Size(max = 1000, message = "Los logros no pueden exceder 1000 caracteres")
    @Column(length = 1000)
    private String logros;

    @Size(max = 500, message = "La URL del CV no puede exceder 500 caracteres")
    @Column(length = 500)
    private String urlCvPdf;

    @PrePersist
    protected void onCreate() {
        if (this.fechaCreacion == null) {
            this.fechaCreacion = LocalDate.now();
        }
        this.fechaActualizacion = LocalDate.now();
        if (this.isActive == null) {
            this.isActive = true;
        }
        if (this.esPublica == null) {
            this.esPublica = false;
        }
        log.info("Hoja de vida creada: {} para aspirante ID: {}", this.titulo, this.aspirante != null ? this.aspirante.getId() : "N/A");
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDate.now();
        log.info("Hoja de vida actualizada: ID {}", this.id);
    }
}
