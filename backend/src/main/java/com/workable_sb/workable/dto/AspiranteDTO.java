package com.workable_sb.workable.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AspiranteDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String correo;
    private LocalDate fechaNacimiento;
    private Object municipio;
    private String genero;
    private String rol;
    private String telefono;
    private String urlFotoPerfil;
    private String ubicacion;
    private LocalDate fechaCreacion;
    private List<Long> hojasVidaIds;
    private List<Long> postulacionIds;
}
