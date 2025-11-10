package com.workable_sb.workable.dto.dataestudio;

import lombok.Data;
import java.sql.Date;

@Data
public class DataEstudioReadDto {
    private Integer id;
    private String nombre;
    private Date fechaInicio;
    private Date fechaFin;
    private Boolean enCurso;
    private String institucion;
    private String certificadoUrl;
    private String nivelEducativoNombre;
    private Integer nivelEducativoId;
    private Integer usuarioId;
    private String estado;
}
