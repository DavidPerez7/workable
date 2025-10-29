package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.UsrReclutadorDto;
import com.workable_sb.workable.dto.UsrReclutadorReadDto;
import com.workable_sb.workable.mapper.UsrReclutadorMapper;
import com.workable_sb.workable.models.UsrReclutador;
import com.workable_sb.workable.repository.UsrReclutadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UsrReclutadorServiceImple implements UsrReclutadorService {
    
    private final UsrReclutadorRepository reclutadorRepository;
    private final UsrReclutadorMapper reclutadorMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UsrReclutadorServiceImple(UsrReclutadorRepository reclutadorRepository,
                                     UsrReclutadorMapper reclutadorMapper) {
        this.reclutadorRepository = reclutadorRepository;
        this.reclutadorMapper = reclutadorMapper;
    }

    @Override
    public UsrReclutadorDto crear(UsrReclutadorDto dto) {
        UsrReclutador reclutador = reclutadorMapper.toEntity(dto);
        // Encriptar la contraseña antes de guardar
        reclutador.setClave(passwordEncoder.encode(reclutador.getClave()));
        UsrReclutador guardado = reclutadorRepository.save(reclutador);
        return reclutadorMapper.toDto(guardado);
    }

    @Override
    public UsrReclutadorReadDto buscarPorId(Integer id) {
        return reclutadorRepository.findById(id)
            .map(reclutadorMapper::toReadDto)  // Sin clave
            .orElseThrow(() -> new EntityNotFoundException("Reclutador no encontrado con id: " + id));
    }

    @Override
    public List<UsrReclutadorReadDto> listarTodos() {
        return reclutadorRepository.findAll().stream()
            .map(reclutadorMapper::toReadDto)  // Sin clave
            .collect(Collectors.toList());
    }

    @Override
    public UsrReclutadorDto actualizar(Integer id, UsrReclutadorDto dto) {
        return reclutadorRepository.findById(id)
            .map(reclutador -> {
                // Actualizar campos de Usuario
                if (dto.getNombre() != null) reclutador.setNombre(dto.getNombre());
                if (dto.getCorreo() != null) reclutador.setCorreo(dto.getCorreo());
                if (dto.getTelefono() != null) reclutador.setTelefono(dto.getTelefono());
                if (dto.getFotoPerfilUrl() != null) reclutador.setFotoPerfilUrl(dto.getFotoPerfilUrl());
                
                // Si se proporciona una nueva clave, encriptarla
                if (dto.getClave() != null && !dto.getClave().isEmpty()) {
                    reclutador.setClave(passwordEncoder.encode(dto.getClave()));
                }
                
                UsrReclutador actualizado = reclutadorRepository.save(reclutador);
                return reclutadorMapper.toDto(actualizado);
            })
            .orElseThrow(() -> new EntityNotFoundException("Reclutador no encontrado con id: " + id));
    }

    @Override
    public void eliminar(Integer id) {
        reclutadorRepository.deleteById(id);
    }
}
