package com.workable_sb.workable.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {
    private String token;
    private String rol;
    private Long usuarioId;
    private String nombre;
    private String apellido;
    private String correo;
    private Map<String, Object> empresa;
}
