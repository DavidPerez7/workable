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
public class ExperienciaData {
    
    @NotBlank(message = "El cargo es obligatorio")
    @Column(length = 255)
    private String cargo;

    @NotBlank(message = "La empresa es obligatoria")
    @Column(length = 255)
    private String empresa;

    @NotNull(message = "La fecha de inicio es obligatoria")
    @Column
    private LocalDate fechaInicio;

    @Column
    private LocalDate fechaFin;

    @Column(length = 200)
    private String municipio;

    @Column(length = 1000)
    private String descripcion;

    @Column(length = 500)
    private String certificadoUrl;
}
