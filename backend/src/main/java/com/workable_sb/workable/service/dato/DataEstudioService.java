package com.workable_sb.workable.service.dato;

import com.workable_sb.workable.dto.dato.DataEstudioDto;
import java.util.List;

public interface DataEstudioService {
    DataEstudioDto create(DataEstudioDto dto);
    DataEstudioDto update(Integer id, DataEstudioDto dto);
    void delete(Integer id);
    DataEstudioDto findById(Integer id);
    List<DataEstudioDto> findAll();
}
