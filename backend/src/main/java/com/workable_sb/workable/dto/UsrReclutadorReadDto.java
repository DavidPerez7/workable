package com.workable_sb.workable.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsrReclutadorReadDto {
    private Integer id;
    
    // Campos heredados de Usuario (SIN clave)
    private String nombre;
    private String correo;
    private Long telefono;
    private String fotoPerfilUrl;
    // NO incluye clave por seguridad
    
    // Municipio
    private Integer municipioId;
    private String municipioNombre;
    
    // Empresa
    private Long empresaId;
    private String empresaNombre;
}
