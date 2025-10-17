package com.workable_sb.workable.dto;

import lombok.Data;

@Data
public class AdministradorDto {
    private Integer administradorId;
    private String nombre;
    private String correo;
    private String rol;
}
