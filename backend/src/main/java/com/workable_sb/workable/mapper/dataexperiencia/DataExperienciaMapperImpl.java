package com.workable_sb.workable.mapper.dataexperiencia;

import org.springframework.stereotype.Component;
import com.workable_sb.workable.dto.dataexperiencia.*;
import com.workable_sb.workable.models.DataExperiencia;
import com.workable_sb.workable.repository.UsuarioRepository;

@Component
public class DataExperienciaMapperImpl implements DataExperienciaMapper {

    private final UsuarioRepository usuarioRepo;

    public DataExperienciaMapperImpl(UsuarioRepository usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }

    @Override
    public DataExperiencia toEntity(Object dto, DataExperiencia original) {
        if (dto == null) return null;
        DataExperiencia entity = (original != null) ? original : new DataExperiencia();
        try {
            java.lang.reflect.Method getCargo = dto.getClass().getMethod("getCargo");
            java.lang.reflect.Method getEmpresa = dto.getClass().getMethod("getEmpresa");
            java.lang.reflect.Method getDescripcion = dto.getClass().getMethod("getDescripcion");
            java.lang.reflect.Method getExpYears = dto.getClass().getMethod("getExpYears");
            java.lang.reflect.Method getFechaInicio = dto.getClass().getMethod("getFechaInicio");
            java.lang.reflect.Method getFechaFin = dto.getClass().getMethod("getFechaFin");
            java.lang.reflect.Method getTrabajoActual = dto.getClass().getMethod("getTrabajoActual");
            java.lang.reflect.Method getUbicacion = dto.getClass().getMethod("getUbicacion");
            entity.setCargo((String) getCargo.invoke(dto));
            entity.setEmpresa((String) getEmpresa.invoke(dto));
            entity.setDescripcion((String) getDescripcion.invoke(dto));
            entity.setExpYears((Float) getExpYears.invoke(dto));
            entity.setFechaInicio((java.time.LocalDate) getFechaInicio.invoke(dto));
            entity.setFechaFin((java.time.LocalDate) getFechaFin.invoke(dto));
            entity.setTrabajoActual((Boolean) getTrabajoActual.invoke(dto));
            entity.setUbicacion((String) getUbicacion.invoke(dto));
            // usuarioId solo en create
            try {
                java.lang.reflect.Method getUsuarioId = dto.getClass().getMethod("getUsuarioId");
                Integer usuarioId = (Integer) getUsuarioId.invoke(dto);
                if (usuarioId == null) {
                    throw new IllegalArgumentException("usuarioId no puede ser null");
                } else {
                    entity.setUsuario(usuarioRepo.findById(usuarioId).orElse(null));
                }
            } catch (NoSuchMethodException ignored) {}
            // estado solo en update
            try {
                java.lang.reflect.Method getEstado = dto.getClass().getMethod("getEstado");
                Object estadoValue = getEstado.invoke(dto);
                if (estadoValue != null && estadoValue instanceof String) {
                    entity.setEstado(stringToEstadoEnum((String) estadoValue, DataExperiencia.Estado.class));
                }
            } catch (NoSuchMethodException ignored) {}
        } catch (Exception e) {
            throw new RuntimeException("Error mapeando DataExperiencia", e);
        }
        return entity;
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
