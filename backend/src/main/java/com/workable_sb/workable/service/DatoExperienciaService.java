package com.workable_sb.workable.service;

import java.util.List;

import com.workable_sb.workable.dto.DatoExperienciaDto;

public interface DatoExperienciaService {
    DatoExperienciaDto crearyupdate(DatoExperienciaDto datoExperienciaDto);
    DatoExperienciaDto buscarPorId(Integer experiencia_id);
    List<DatoExperienciaDto> listarTodos();
    void eliminar(Integer experiencia_id);
}
