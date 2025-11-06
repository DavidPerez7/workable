package com.workable_sb.workable.dto.usuario;
import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsrAspiranteDto {
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
    
    // Campos específicos de UsrAspirante
    @NotNull(message = "El apellido es obligatorio")
    private String apellido;
    
    private String resumenProfesional;
    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate fechaNacimiento;

    @NotNull(message = "El id del municipio es obligatorio")
    private Integer municipio_id;
    private String municipio_nom;

    @NotNull(message = "El id del genero es obligatorio")
    private Short genero_id;
    private String genero_nom;
}
