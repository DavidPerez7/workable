package com.workable_sb.workable.dto;

import lombok.Data;

@Data
public class UsuarioDto {
    private Integer usuarioId;
    private String nombre;
    private String correo;
    private String rol;
}
