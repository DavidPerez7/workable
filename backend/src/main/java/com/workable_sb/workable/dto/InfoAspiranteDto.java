package com.workable_sb.workable.dto;
import java.sql.Date;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InfoAspiranteDto {
    private Integer id;

    @NotNull
    private Integer telef;

    @NotNull
    private Date fechNac;

    @NotNull(message = "El id del municipio es obligatorio")
    private Integer municipio_id;
    private String nombremun;

    @NotNull(message = "El id del genero es obligatorio")
    private Short genero_id;
    private String nombregenr;

    @NotNull(message = "El id de usuario es obligatorio")
    private Integer usuario_id;
    private String nombreusuario;

}
