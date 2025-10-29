package com.workable_sb.workable.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.DataExperienciaDto;
import com.workable_sb.workable.mapper.DataExperienciaMapper;
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
        DataExperiencia datoExperienciaGuardado = datoExperienciaRepository.save(datoExperiencia);
        return datoExperienciaMapper.toDto(datoExperienciaGuardado);

    }

    @Override
    public DataExperienciaDto buscarPorId(Integer experiencia_id) {
        return datoExperienciaRepository.findById(experiencia_id)
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
        datoExperienciaRepository.deleteById(experiencia_id);
    }
}
