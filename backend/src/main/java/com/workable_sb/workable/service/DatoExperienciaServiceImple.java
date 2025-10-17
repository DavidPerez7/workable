package com.workable_sb.workable.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.DatoExperienciaDto;
import com.workable_sb.workable.mapper.DatoExperienciaMapper;
import com.workable_sb.workable.models.DatoExperiencia;
import com.workable_sb.workable.repositories.DatoExperienciaRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class DatoExperienciaServiceImple implements DatoExperienciaService {

    private final DatoExperienciaRepository datoExperienciaRepository;
    private final DatoExperienciaMapper datoExperienciaMapper;

    public DatoExperienciaServiceImple(DatoExperienciaRepository datoExperienciaRepository, DatoExperienciaMapper datoExperienciaMapper) {
        this.datoExperienciaRepository = datoExperienciaRepository;
        this.datoExperienciaMapper = datoExperienciaMapper;
    }

    @Override
    public DatoExperienciaDto crearyupdate (DatoExperienciaDto datoExperienciaDto) {
        DatoExperiencia datoExperiencia = datoExperienciaMapper.consult(datoExperienciaDto);
        DatoExperiencia datoExperienciaGuardado = datoExperienciaRepository.save(datoExperiencia);
        return datoExperienciaMapper.consultDto(datoExperienciaGuardado);

    }

    @Override
    public DatoExperienciaDto buscarPorId(Integer experiencia_id) {
        return datoExperienciaRepository.findById(experiencia_id)
                .map(datoExperienciaMapper::consultDto)
                .orElseThrow(() -> new EntityNotFoundException("Experiencia no encontrada"));
    }

    @Override
    public List<DatoExperienciaDto> listarTodos() {
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
