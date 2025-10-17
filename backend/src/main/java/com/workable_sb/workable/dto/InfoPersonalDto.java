package com.workable_sb.workable.dto;
import java.sql.Date;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InfoPersonalDto {
    private Integer infPerson_id;

    @NotNull
    private String ubic;

    @NotNull
    private Integer telef;

    @NotNull
    private Date fechnac;

    @NotNull
    private String fotperfil;

    @NotNull(message = "El id del genero es obligatorio")
    private Short genero_id;

    private String nombregenr;

    @NotNull(message = "El id de usuario es obligatorio")
    private Integer usuario_id;

    private String nombreusuario;

}
