package com.workable_sb.workable.service.dato;

import java.util.List;

import com.workable_sb.workable.dto.dato.DataExperienciaDto;

public interface DatoExperienciaService {
    DataExperienciaDto crearyupdate(DataExperienciaDto datoDataExperienciaDto);
    DataExperienciaDto buscarPorId(Integer experiencia_id);
    List<DataExperienciaDto> listarTodos();
    void eliminar(Integer experiencia_id);
}
