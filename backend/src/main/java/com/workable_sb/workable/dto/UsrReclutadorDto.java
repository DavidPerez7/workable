package com.workable_sb.workable.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsrReclutadorDto {
    private Integer id;
    
    // Campos heredados de Usuario
    @NotNull(message = "El nombre es obligatorio")
    private String nombre;
    
    @NotNull(message = "El correo es obligatorio")
    private String correo;
    
    @NotNull(message = "La clave es obligatoria")
    private String clave;
    
    private Long telefono;
    private String fotoPerfilUrl;
    
    // Campos específicos de UsrReclutador (si los hay en el modelo)
    // No hay campos adicionales en UsrReclutador según el modelo
    
    @NotNull(message = "El id del municipio es obligatorio")
    private Integer municipio_id;
    private String municipio_nom;
    
    //null para crear por primera vez sin empresa
    private Long empresa_nit_id;
    private String empresa_nom;
}
