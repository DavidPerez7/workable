package com.workable_sb.workable.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValoracionReadDto {
    private Integer id;
    private String descripcion;
    private Float puntuacion;
    private LocalDate fechaValoracion;

    private Long empresaId;
    private String empresaNombre;

    private Integer usuarioId;
    private String usuarioNombre;
}
