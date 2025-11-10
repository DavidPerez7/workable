package com.workable_sb.workable.mapper.dataexperiencia;

import com.workable_sb.workable.dto.dataexperiencia.DataExperienciaCreateDto;
import com.workable_sb.workable.dto.dataexperiencia.DataExperienciaReadDto;
import com.workable_sb.workable.dto.dataexperiencia.DataExperienciaUpdateDto;
import com.workable_sb.workable.models.DataExperiencia;

public interface DataExperienciaMapper {
    DataExperiencia toEntity(DataExperienciaCreateDto dto);
    DataExperiencia toEntity(DataExperienciaUpdateDto dto, DataExperiencia original);
    DataExperienciaReadDto toDto(DataExperiencia entity);
    String estadoEnumToString(Enum<?> estado);
    <E extends Enum<E>> E stringToEstadoEnum(String estado, Class<E> enumType);
}
