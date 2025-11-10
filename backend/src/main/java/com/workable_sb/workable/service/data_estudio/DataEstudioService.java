
package com.workable_sb.workable.service.data_estudio;

import com.workable_sb.workable.dto.dataestudio.DataEstudioDto;
import com.workable_sb.workable.dto.dataestudio.DataEstudioReadDto;
import java.util.List;

public interface DataEstudioService {
    DataEstudioReadDto create(DataEstudioDto dto);
    DataEstudioReadDto update(Integer id, DataEstudioDto dto);
    void delete(Integer id);
    DataEstudioReadDto findById(Integer id);
    List<DataEstudioReadDto> findAll();
}
