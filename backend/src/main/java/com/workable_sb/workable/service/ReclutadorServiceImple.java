package com.workable_sb.workable.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.ReclutadorDto;
import com.workable_sb.workable.dto.ReclutadorReadDto;
import com.workable_sb.workable.mapper.ReclutadorMapper;
import com.workable_sb.workable.models.Reclutador;
import com.workable_sb.workable.repositories.AspiranteRepository;
import com.workable_sb.workable.repositories.EmpresaRepository;
import com.workable_sb.workable.repositories.ReclutadorRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ReclutadorServiceImple implements ReclutadorService {

    private final ReclutadorRepository reclutadorRepository;
    private final ReclutadorMapper reclutadorMapper;

    public ReclutadorServiceImple(ReclutadorRepository reclutadorRepository,ReclutadorMapper reclutadorMapper, EmpresaRepository empresaRepository, AspiranteRepository aspiranteRepository, AspiranteRepository aspiranteRepository2) {
        this.reclutadorRepository = reclutadorRepository;
        this.reclutadorMapper = reclutadorMapper;
    }

    @Override
    public ReclutadorReadDto crearyupdate(ReclutadorDto reclutadorDto) {
        Reclutador reclutador = reclutadorMapper.consult(reclutadorDto);
        Reclutador guardado = reclutadorRepository.save(reclutador);
        return reclutadorMapper.consultReadDto(guardado);
    }

    @Override
    public ReclutadorReadDto buscarPorId(Integer reclutador_id) {
        return reclutadorRepository.findById(reclutador_id)
            .map(reclutadorMapper::consultReadDto)
            .orElseThrow(() -> new EntityNotFoundException("Reclutador no encontrado"));
    }

    @Override
    public List<ReclutadorReadDto> listarTodos() {
        return reclutadorRepository.findAll()
            .stream()
            .map(reclutadorMapper::consultReadDto)
            .collect(Collectors.toList());
    }

    @Override
    public void eliminar(Integer reclutador_id) {
        reclutadorRepository.deleteById(reclutador_id);
    }
}
