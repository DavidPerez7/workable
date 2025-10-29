package com.workable_sb.workable.dto;

import java.sql.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsrAspiranteReadDto {
    private Integer id;
    
    // Campos heredados de Usuario (SIN clave)
    private String nombre;
    private String correo;
    private Long telefono;
    private String fotoPerfilUrl;
    // NO incluye clave por seguridad
    
    // Campos específicos de UsrAspirante
    private String apellido;
    private String resumenProfesional;
    private Date fechNac;
    
    // Municipio
    private Integer municipio_id;
    private String municipio_nom;
    
    // Género
    private Short genero_id;
    private String genero_nom;
}
