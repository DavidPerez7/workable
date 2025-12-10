package com.workable_sb.workable.models;

import java.time.LocalDate;

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
    private String redSocial2;

    @Size(max = 500)
    @Column(length = 500)
    private String objetivoProfesional;

    @Min(value = 0)
    private Long salarioEsperado;

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
