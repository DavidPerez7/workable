package com.workable_sb.workable.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsuarioDto {
    private Integer id;
    @NotNull
    private String nombre;
    @NotNull
    private String correo;
    private Long telefono;
    @NotNull
    private String clave;
    @NotNull
    private String rol;
    private String token;

    private String fotoPerfilUrl;

    @NotNull(message = "El id de municipio es obligatorio")
    private Integer municipio_id;
    private String municipio_nom;
}
