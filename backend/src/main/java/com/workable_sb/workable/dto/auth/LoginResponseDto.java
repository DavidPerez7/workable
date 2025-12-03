package com.workable_sb.workable.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {
    private String token;
    private String refreshToken;
    private String rol;
    private Long usuarioId;
    private String nombre;
    private String correo;
}
