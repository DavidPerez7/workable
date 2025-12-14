package com.workable_sb.workable.models;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aspirante_id", nullable = false, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private Aspirante aspirante;

    @Size(max = 1000, message = "Resumen no puede exceder 1000 caracteres")
    @Column(length = 1000)
    private String resumenProfesional;

    @Size(max = 255)
    @Column(length = 255)
    private String redSocial1;

    @Size(max = 255)
    @Column(length = 255)
    private String contactoEmail;

    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    @Column(length = 20)
    private String telefono;

    @Size(max = 500)
    @Column(length = 500)
    private String objetivoProfesional;

    // Estudios y experiencias se exponen en la Hoja de Vida para conveniencia,
    // pero NO se persisten directamente aquí (se almacenan en sus propias tablas
    // y se relacionan con el aspirante). Marcamos @Transient para que JPA no
    // intente mapear estas listas.
    @Transient
    private List<Estudio> estudios;

    @Transient
    private List<Experiencia> experiencias;

    @Size(max = 500)
    @Column(length = 500)
    private String idiomas;

    @Column(nullable = false)
    private Boolean esPublica = false;

    private LocalDate fechaCreacion;
    private LocalDate fechaActualizacion;

    @PrePersist
    protected void onCreate() {
        if (this.fechaCreacion == null) {
            this.fechaCreacion = LocalDate.now();
        }
        this.fechaActualizacion = LocalDate.now();
        if (this.esPublica == null) {
            this.esPublica = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDate.now();
    }
}
