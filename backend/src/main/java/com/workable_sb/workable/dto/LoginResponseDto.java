package com.workable_sb.workable.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {
    private String token;
    private Integer id;
    private String nombre;
    private String apellido;
    private String correo;
    private String ubicacion;
    private Long telefono;
    private String nombreTipDoc;
    private String nombreMunicipio;
    private String nombreGenero;
    private String role;
    private Integer empresaId;
}