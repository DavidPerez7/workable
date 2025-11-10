package com.workable_sb.workable.service.dataexperiencia;

import com.workable_sb.workable.dto.dataexperiencia.*;
import java.util.List;

public interface DataExperienciaService {
    DataExperienciaReadDto create(DataExperienciaCreateDto dto);
    DataExperienciaReadDto update(Integer id, DataExperienciaUpdateDto dto);
    void delete(Integer id);
    DataExperienciaReadDto findById(Integer id);
    List<DataExperienciaReadDto> findAll();
    DataExperienciaReadDto changeEstado(Integer id, String estado);
}
