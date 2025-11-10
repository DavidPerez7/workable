package com.workable_sb.workable.dto.dataestudio;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.sql.Date;

@Data
public class DataEstudioDto {
    private Integer id;
    @NotBlank
    private String nombre;
    @NotNull
    private Date fechaInicio;
    private Date fechaFin;
    @NotNull
    private Boolean enCurso;
    @NotBlank
    private String institucion;
    @NotBlank
    private String certificadoUrl;
    @NotNull
    private Integer nivelEducativoId;
    @NotNull
    private Integer usuarioId;
    private String estado; // ACTIVO o INACTIVO
}
