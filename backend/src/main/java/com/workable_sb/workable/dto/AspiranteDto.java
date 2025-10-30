package com.workable_sb.workable.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AspiranteDto {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    @NotBlank(message = "El apellido es obligatorio")
    private String apellido;
    
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo debe ser válido")
    private String correo;
    
    private String ubicacion;
    
    private Long telefono;
    
    @NotNull(message = "El número de documento es obligatorio")
    private Integer numeroDoc;
    
    @NotBlank(message = "La clave es obligatoria")
    private String clave;
    
    @NotNull(message = "El tipo de documento es obligatorio")
    private Integer tipoDocumentoId;
    
    @NotNull(message = "El municipio es obligatorio")
    private Integer municipioId;
    
    @NotNull(message = "El género es obligatorio")
    private Integer generoId;
}
