package com.workable_sb.workable.dto;

import lombok.Data;

@Data
public class RegistroAspiranteDTO {
    private String nombre;
    private String apellido;
    private String correo;
    private String ubicacion;
    private Long telefono;
    private Integer numero_Doc;
    private String clave;
    private Integer tipoDocumentoId;
    private Integer municipioId;
    private Integer generoId;
}
