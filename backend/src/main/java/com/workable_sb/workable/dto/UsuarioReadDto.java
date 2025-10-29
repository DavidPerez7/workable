package com.workable_sb.workable.dto;

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
    private String rol;
    private String fotoPerfilUrl;
    
    private Integer municipio_id;
    private String municipio_nom;
}
