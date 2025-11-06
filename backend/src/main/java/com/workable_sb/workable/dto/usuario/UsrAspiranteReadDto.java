package com.workable_sb.workable.dto.usuario;

import java.time.LocalDate;

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
    private LocalDate fechaNacimiento;
    
    private Integer municipioId;
    private String municipioNombre;
    
    private Short generoId;
    private String generoNombre;
}
