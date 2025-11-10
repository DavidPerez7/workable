package com.workable_sb.workable.dto.dataexperiencia;

// import com.workable_sb.workable.models.DataExperiencia;
import lombok.Data;
import java.time.LocalDate;

@Data
public class DataExperienciaReadDto {
    private Long id;
    private String cargo;
    private String empresa;
    private String descripcion;
    private Float expYears;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Boolean trabajoActual;
    private String ubicacion;
    private String estado;
}
