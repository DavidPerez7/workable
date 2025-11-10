package com.workable_sb.workable.mapper.dataexperiencia;

import org.springframework.stereotype.Component;
import com.workable_sb.workable.dto.dataexperiencia.*;
import com.workable_sb.workable.models.DataExperiencia;

@Component
public class DataExperienciaMapperImpl implements DataExperienciaMapper {
    @Override
    public DataExperiencia toEntity(DataExperienciaCreateDto dto) {
        if (dto == null) return null;
        DataExperiencia entity = new DataExperiencia();
        entity.setCargo(dto.getCargo());
        entity.setEmpresa(dto.getEmpresa());
        entity.setDescripcion(dto.getDescripcion());
    entity.setExpYears(dto.getExpYears());
    entity.setFechaInicio(dto.getFechaInicio());
    entity.setFechaFin(dto.getFechaFin());
        entity.setTrabajoActual(dto.getTrabajoActual());
        entity.setUbicacion(dto.getUbicacion());
        // Estado por defecto ACTIVO
        entity.setEstado(DataExperiencia.Estado.ACTIVO);
        return entity;
    }

    @Override
    public DataExperiencia toEntity(DataExperienciaUpdateDto dto, DataExperiencia original) {
        if (dto == null || original == null) return null;
        original.setCargo(dto.getCargo());
        original.setEmpresa(dto.getEmpresa());
        original.setDescripcion(dto.getDescripcion());
    original.setExpYears(dto.getExpYears());
    original.setFechaInicio(dto.getFechaInicio());
    original.setFechaFin(dto.getFechaFin());
        original.setTrabajoActual(dto.getTrabajoActual());
        original.setUbicacion(dto.getUbicacion());
        if (dto.getEstado() != null) {
            original.setEstado(stringToEstadoEnum(dto.getEstado(), DataExperiencia.Estado.class));
        }
        return original;
    }

    @Override
    public DataExperienciaReadDto toDto(DataExperiencia entity) {
        if (entity == null) return null;
        DataExperienciaReadDto dto = new DataExperienciaReadDto();
        dto.setId(entity.getId() != null ? Long.valueOf(entity.getId()) : null);
        dto.setCargo(entity.getCargo());
        dto.setEmpresa(entity.getEmpresa());
        dto.setDescripcion(entity.getDescripcion());
    dto.setExpYears(entity.getExpYears());
    dto.setFechaInicio(entity.getFechaInicio());
    dto.setFechaFin(entity.getFechaFin());
        dto.setTrabajoActual(entity.getTrabajoActual());
        dto.setUbicacion(entity.getUbicacion());
        dto.setEstado(estadoEnumToString(entity.getEstado()));
        return dto;
    }

    @Override
    public String estadoEnumToString(Enum<?> estado) {
        return estado != null ? estado.name() : null;
    }

    @Override
    public <E extends Enum<E>> E stringToEstadoEnum(String estado, Class<E> enumType) {
        if (estado == null) return null;
        try {
            return Enum.valueOf(enumType, estado.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
