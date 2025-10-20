package com.workable_sb.workable.service;

import java.util.List;

import com.workable_sb.workable.dto.ExperienciaDto;

public interface DatoExperienciaService {
    ExperienciaDto crearyupdate(ExperienciaDto datoExperienciaDto);
    ExperienciaDto buscarPorId(Integer experiencia_id);
    List<ExperienciaDto> listarTodos();
    void eliminar(Integer experiencia_id);
}
