package com.workable_sb.workable.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.workable_sb.workable.dto.ReclutadorDto;
import com.workable_sb.workable.dto.ReclutadorReadDto;
import com.workable_sb.workable.mapper.ReclutadorMapper;
import com.workable_sb.workable.models.Reclutador;
import com.workable_sb.workable.repository.AspiranteRepository;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.ReclutadorRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ReclutadorServiceImple implements ReclutadorService {

    private final ReclutadorRepository reclutadorRepository;
    private final ReclutadorMapper reclutadorMapper;
    private final PasswordEncoder passwordEncoder;

    public ReclutadorServiceImple(ReclutadorRepository reclutadorRepository,ReclutadorMapper reclutadorMapper, EmpresaRepository empresaRepository, AspiranteRepository aspiranteRepository, AspiranteRepository aspiranteRepository2, PasswordEncoder passwordEncoder) {
        this.reclutadorRepository = reclutadorRepository;
        this.reclutadorMapper = reclutadorMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public ReclutadorReadDto crearyupdate(ReclutadorDto reclutadorDto) {
        Reclutador reclutador = reclutadorMapper.consult(reclutadorDto);
        // Encode password before saving so authentication with PasswordEncoder.matches works
        if (reclutador.getClave() != null && !reclutador.getClave().isEmpty()) {
            reclutador.setClave(passwordEncoder.encode(reclutador.getClave()));
        }
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
