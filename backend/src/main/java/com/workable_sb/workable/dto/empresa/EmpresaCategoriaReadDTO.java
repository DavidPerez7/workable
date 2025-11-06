package com.workable_sb.workable.dto.empresa;

import com.workable_sb.workable.models.EmpresaCategoria.EstadoCategoria;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmpresaCategoriaReadDTO {
    private Integer id;
    private String nombre;
    private String imagenUrl;
    private String descripcion;
    private EstadoCategoria estado;
}
