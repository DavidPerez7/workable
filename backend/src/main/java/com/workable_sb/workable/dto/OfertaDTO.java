package com.workable_sb.workable.dto;

import java.time.LocalDate;
import java.util.Set;

public class OfertaDTO {
    public String titulo;
    public String descripcion;
    public LocalDate fechaLimite;
    public Long salario;
    public Integer numeroVacantes;
    public String nivelExperiencia;
    public String estado;
    public Set<String> requisitos;
    public Long municipioId;
    public String modalidad;
    public String tipoContrato;
    public Long empresaId;
    public Set<String> beneficios;
}
