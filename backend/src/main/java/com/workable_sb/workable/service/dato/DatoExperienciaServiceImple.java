package com.workable_sb.workable.service.dato;

import java.util.Objects;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.dato.DataExperienciaDto;
import com.workable_sb.workable.mapper.dato.DataExperienciaMapper;
import com.workable_sb.workable.models.DataExperiencia;
import com.workable_sb.workable.repository.DataExperienciaRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class DatoExperienciaServiceImple implements DatoExperienciaService {

    private final DataExperienciaRepository datoExperienciaRepository;
    private final DataExperienciaMapper datoExperienciaMapper;

    public DatoExperienciaServiceImple(DataExperienciaRepository datoExperienciaRepository, DataExperienciaMapper datoExperienciaMapper) {
        this.datoExperienciaRepository = datoExperienciaRepository;
        this.datoExperienciaMapper = datoExperienciaMapper;
    }

    @Override
    public DataExperienciaDto crearyupdate (DataExperienciaDto datoDataExperienciaDto) {
        DataExperiencia datoExperiencia = datoExperienciaMapper.toEntity(datoDataExperienciaDto);
    datoExperiencia = Objects.requireNonNull(datoExperiencia, "No se pudo mapear la entidad DataExperiencia");
    DataExperiencia datoExperienciaGuardado = datoExperienciaRepository.save(datoExperiencia);
    datoExperienciaGuardado = Objects.requireNonNull(datoExperienciaGuardado, "No se pudo guardar la entidad DataExperiencia");
        return datoExperienciaMapper.toDto(datoExperienciaGuardado);

    }

    @Override
    public DataExperienciaDto buscarPorId(Integer experiencia_id) {
    Integer safeId = Objects.requireNonNull(experiencia_id, "El id no puede ser nulo");
    return datoExperienciaRepository.findById(safeId)
                .map(datoExperienciaMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Experiencia no encontrada"));
    }

    @Override
    public List<DataExperienciaDto> listarTodos() {
        return datoExperienciaRepository.findAll()
                .stream()
                .map(datoExperienciaMapper::toDto)
                .collect(Collectors.toList());
    }


    @Override
    public void eliminar(Integer experiencia_id) {
    Integer safeId = Objects.requireNonNull(experiencia_id, "El id no puede ser nulo");
    datoExperienciaRepository.deleteById(safeId);
    }
}
