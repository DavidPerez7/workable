package com.workable_sb.workable.service.dataexperiencia;

import com.workable_sb.workable.dto.dataexperiencia.*;
import com.workable_sb.workable.mapper.dataexperiencia.DataExperienciaMapper;
import com.workable_sb.workable.models.DataExperiencia;
import com.workable_sb.workable.repository.dataexperiencia.DataExperienciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
@Transactional
public class DataExperienciaServiceImpl implements DataExperienciaService {
    private final DataExperienciaRepository repository;
    private final DataExperienciaMapper mapper;

    @Override
    public DataExperienciaReadDto create(DataExperienciaCreateDto dto) {
        DataExperiencia entity = mapper.toEntity(dto);
        DataExperiencia saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    @Override
    public DataExperienciaReadDto update(Integer id, DataExperienciaUpdateDto dto) {
        DataExperiencia entity = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("DataExperiencia not found"));
        mapper.toEntity(dto, entity);
        DataExperiencia saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    @Override
    public void delete(Integer id) {
        if (!repository.existsById(id)) throw new EntityNotFoundException("DataExperiencia not found");
        repository.deleteById(id);
    }

    @Override
    public DataExperienciaReadDto findById(Integer id) {
        DataExperiencia entity = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("DataExperiencia not found"));
        return mapper.toDto(entity);
    }

    @Override
    public List<DataExperienciaReadDto> findAll() {
        return repository.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    @Override
    public DataExperienciaReadDto changeEstado(Integer id, String estado) {
        DataExperiencia entity = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("DataExperiencia not found"));
        entity.setEstado(DataExperiencia.Estado.valueOf(estado));
        DataExperiencia saved = repository.save(entity);
        return mapper.toDto(saved);
    }
}
