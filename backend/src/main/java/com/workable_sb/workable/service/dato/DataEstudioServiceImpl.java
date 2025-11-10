

package com.workable_sb.workable.service.dato;

import com.workable_sb.workable.dto.dataestudio.DataEstudioDto;
import com.workable_sb.workable.dto.dataestudio.DataEstudioReadDto;
import com.workable_sb.workable.mapper.dataestudio.DataEstudioMapper;
import com.workable_sb.workable.models.DataEstudio;
import com.workable_sb.workable.repository.dataestudio.DataEstudioRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DataEstudioServiceImpl implements DataEstudioService {
    private final DataEstudioRepository repository;
    private final DataEstudioMapper mapper;

    public DataEstudioServiceImpl(DataEstudioRepository repository, DataEstudioMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public DataEstudioReadDto create(DataEstudioDto dto) {
        if (dto == null) throw new IllegalArgumentException("El dto no puede ser nulo");
        DataEstudio entity = mapper.toEntity(dto);
        if (entity == null) throw new IllegalArgumentException("La entidad no puede ser nula");
        DataEstudio saved = repository.save(entity);
        return mapper.toReadDto(saved);
    }

    @Override
    public DataEstudioReadDto update(Integer id, DataEstudioDto dto) {
        if (id == null) throw new IllegalArgumentException("El id no puede ser nulo");
        DataEstudio entity = repository.findById(id).orElseThrow(() -> new RuntimeException("No encontrado"));
        // Setters manuales para actualizar campos
        entity.setNombre(dto.getNombre());
        entity.setFechaInicio(dto.getFechaInicio());
        entity.setFechaFin(dto.getFechaFin());
        entity.setEnCurso(dto.getEnCurso());
        entity.setCertificadoUrl(dto.getCertificadoUrl());
        entity.setInstitucion(dto.getInstitucion());
        // Estado
        if (dto.getEstado() != null) {
            try {
                entity.setEstado(DataEstudio.EstadoType.valueOf(dto.getEstado()));
            } catch (IllegalArgumentException e) {
                // No cambiar estado si valor inválido
            }
        }
        // No se actualizan relaciones (usuario, nivelEducativo) aquí
        return mapper.toReadDto(repository.save(entity));
    }

    @Override
    public void delete(Integer id) {
        if (id == null) throw new IllegalArgumentException("El id no puede ser nulo");
        repository.deleteById(id);
    }

    @Override
    public DataEstudioReadDto findById(Integer id) {
        if (id == null) throw new IllegalArgumentException("El id no puede ser nulo");
        return repository.findById(id).map(mapper::toReadDto).orElse(null);
    }

    @Override
    public List<DataEstudioReadDto> findAll() {
        return repository.findAll().stream().map(mapper::toReadDto).collect(Collectors.toList());
    }
}
