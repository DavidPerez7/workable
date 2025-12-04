package com.workable_sb.workable.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitacionRequestDto {
    private Long postulacionId;
    private Long reclutadorId;
    private LocalDate fechaCitacion;
    private String hora; // HH:MM
    private String linkMeet;
    private String detalles;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class CitacionesMultiplesRequestDto {
    private List<Long> postulacionIds;
    private Long reclutadorId;
    private LocalDate fechaCitacion;
    private String hora; // HH:MM
    private String linkMeet;
    private String detalles;
}
