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
    @NotNull
    private String clave;
    @NotNull
    private String rol;
    private byte[] fotoPerfil;

    @NotNull(message = "El id de municipio es obligatorio")
    private Integer municipio_id;

    
}
