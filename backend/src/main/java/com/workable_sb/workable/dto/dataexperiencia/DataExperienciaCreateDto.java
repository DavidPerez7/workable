package com.workable_sb.workable.dto.dataexperiencia;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class DataExperienciaCreateDto {
    @NotBlank
    @Size(max = 255)
    private String cargo;

    @NotBlank
    @Size(max = 255)
    private String empresa;

    @Size(max = 1000)
    private String descripcion;


    @NotNull
    private Float expYears;

    @NotNull
    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    @NotNull
    private Boolean trabajoActual;

    @NotBlank
    @Size(max = 255)
    private String ubicacion;
}
