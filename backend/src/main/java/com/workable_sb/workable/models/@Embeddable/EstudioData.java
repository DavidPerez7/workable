package com.workable_sb.workable.models;

import java.time.LocalDate;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Data
public class EstudioData {
    
    @NotBlank(message = "El título es obligatorio")
    @Column(length = 255)
    private String titulo;

    @NotBlank(message = "La institución es obligatoria")
    @Column(length = 255)
    private String institucion;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private NivelEducativo nivelEducativo;

    @NotNull(message = "La fecha de inicio es obligatoria")
    @Column
    private LocalDate fechaInicio;
    
    @Column
    private LocalDate fechaFin;

    @Column
    private Boolean enCurso = false;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Modalidad modalidad;

    @Column(length = 1000)
    private String descripcion;

    @Column(length = 500)
    private String certificadoUrl;

    public enum Modalidad {
        PRESENCIAL,
        VIRTUAL,
        HIBRIDA
    }

    public enum NivelEducativo {
        PRIMARIA,
        BACHILLERATO,
        TECNICO,
        TECNOLOGO,
        LICENCIATURA,
        UNIVERSITARIO,
        ESPECIALIZACION,
        MAESTRIA,
        DOCTORADO
    }
}
