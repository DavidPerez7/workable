package com.workable_sb.workable.dto;

import com.workable_sb.workable.models.Usuario.RolUsr;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsuarioDto {
    //null al crear, obligatorio al actualizar
    private Integer id;
    @NotNull
    private String nombre;
    @NotNull
    private String correo;
    private Long telefono;
    @NotNull
    private String clave;
    @NotNull
    private RolUsr rol;
    private String token;

    private String fotoPerfilUrl;

    @NotNull(message = "El id de municipio es obligatorio")
    private Integer municipio_id;
    private String municipio_nom;

    private com.workable_sb.workable.models.Usuario.EstadoUsr estado; // ACTIVO o INACTIVO
}
