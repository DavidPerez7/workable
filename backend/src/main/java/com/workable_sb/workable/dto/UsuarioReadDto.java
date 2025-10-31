package com.workable_sb.workable.dto;

import com.workable_sb.workable.models.Usuario.RolUsr;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioReadDto {
    private Integer id;
    private String nombre;
    private String correo;
    private Long telefono;
    private RolUsr rol;
    private String fotoPerfilUrl;
    
    private Integer municipioId;
    private String municipioNombre;
}
