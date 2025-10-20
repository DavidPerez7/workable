package com.workable_sb.workable.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.ExperienciaDto;
import com.workable_sb.workable.mapper.ExperienciaMapper;
import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.repository.DatoExperienciaRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class DatoExperienciaServiceImple implements DatoExperienciaService {

    private final DatoExperienciaRepository datoExperienciaRepository;
    private final ExperienciaMapper datoExperienciaMapper;

    public DatoExperienciaServiceImple(DatoExperienciaRepository datoExperienciaRepository, ExperienciaMapper datoExperienciaMapper) {
        this.datoExperienciaRepository = datoExperienciaRepository;
        this.datoExperienciaMapper = datoExperienciaMapper;
    }

    @Override
    public ExperienciaDto crearyupdate (ExperienciaDto datoExperienciaDto) {
        Experiencia datoExperiencia = datoExperienciaMapper.consult(datoExperienciaDto);
        Experiencia datoExperienciaGuardado = datoExperienciaRepository.save(datoExperiencia);
        return datoExperienciaMapper.consultDto(datoExperienciaGuardado);

    }

    @Override
    public ExperienciaDto buscarPorId(Integer experiencia_id) {
        return datoExperienciaRepository.findById(experiencia_id)
                .map(datoExperienciaMapper::consultDto)
                .orElseThrow(() -> new EntityNotFoundException("Experiencia no encontrada"));
    }

    @Override
    public List<ExperienciaDto> listarTodos() {
        return datoExperienciaRepository.findAll()
                .stream()
                .map(datoExperienciaMapper::consultDto)
                .collect(Collectors.toList());
    }


    @Override
    public void eliminar(Integer experiencia_id) {
        datoExperienciaRepository.deleteById(experiencia_id);
    }
}
