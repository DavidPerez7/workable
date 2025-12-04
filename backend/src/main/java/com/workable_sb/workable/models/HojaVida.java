package com.workable_sb.workable.models;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class HojaVida {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String titulo; // Ej: "Desarrollador Full Stack", "Ingeniero de Software"

    @Column(length = 1000)
    private String resumenProfesional; // Breve descripción profesional

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false)
    private Boolean esPublica = false; // Si es visible para reclutadores

    private LocalDate fechaCreacion;
    private LocalDate fechaActualizacion;

    // Relación con el usuario (aspirante)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false, referencedColumnName = "id")
    @JsonIgnoreProperties({"password", "hojaVida"})
    private Usuario usuario;

    // Información de contacto adicional
    @Column(length = 100)
    private String telefonoAdicional;

    @Column(length = 255)
    private String linkedin;

    @Column(length = 255)
    private String portfolio;

    @Column(length = 255)
    private String github;

    // Información laboral
    @Column(length = 500)
    private String objetivoProfesional;

    @Column(length = 100)
    private String disponibilidad; // Ej: "Inmediata", "2 semanas", "1 mes"

    private Long salarioEsperado;

    @Column(length = 50)
    private String nivelExperiencia; // Ej: "Junior", "Semi-Senior", "Senior"

    // Idiomas (JSON o texto separado por comas)
    @Column(length = 500)
    private String idiomas; // Ej: "Español (Nativo), Inglés (B2), Francés (A1)"

    // Certificaciones adicionales
    @Column(length = 1000)
    private String certificaciones;

    // Referencias
    @Column(length = 1000)
    private String referencias;

    // Logros destacados
    @Column(length = 1000)
    private String logros;

    // URL del CV en PDF (si se sube un archivo)
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
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDate.now();
    }

    // Nota: Los estudios, experiencias y habilidades se obtienen directamente
    // desde las tablas Estudio, Experiencia y UsuarioHabilidad usando el usuarioId
}
