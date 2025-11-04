package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.UsrAspiranteDto;
import com.workable_sb.workable.dto.UsrAspiranteReadDto;
import com.workable_sb.workable.mapper.UsrAspiranteMapper;
import com.workable_sb.workable.models.UsrAspirante;
import com.workable_sb.workable.models.Usuario.EstadoUsr;
import com.workable_sb.workable.repository.UsrAspiranteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UsrAspiranteServiceImple implements UsrAspiranteService {
    
    private final UsrAspiranteRepository aspiranteRepository;
    private final UsrAspiranteMapper aspiranteMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UsrAspiranteServiceImple(UsrAspiranteRepository aspiranteRepository, 
                                    UsrAspiranteMapper aspiranteMapper) {
        this.aspiranteRepository = aspiranteRepository;
        this.aspiranteMapper = aspiranteMapper;
    }

    @Override
    public UsrAspiranteDto crear(UsrAspiranteDto dto) {
        UsrAspirante aspirante = aspiranteMapper.toEntity(dto);
        // Encriptar la contraseña antes de guardar
        aspirante.setClave(passwordEncoder.encode(aspirante.getClave()));
        UsrAspirante guardado = aspiranteRepository.save(aspirante);
        return aspiranteMapper.toDto(guardado);
    }

    @Override
    public UsrAspiranteReadDto buscarPorId(Integer id) {
        return aspiranteRepository.findById(id)
            .filter(a -> a.getEstado() == EstadoUsr.ACTIVO)
            .map(aspiranteMapper::toReadDto)  // Sin clave
            .orElseThrow(() -> new EntityNotFoundException("Aspirante no encontrado con id: " + id));
    }

    @Override
    public List<UsrAspiranteReadDto> listarTodos() {
        return aspiranteRepository.findAll().stream()
            .filter(a -> a.getEstado() == EstadoUsr.ACTIVO)
            .map(aspiranteMapper::toReadDto)  // Sin clave
            .collect(Collectors.toList());
    }

    @Override
    public UsrAspiranteDto actualizar(Integer id, UsrAspiranteDto dto) {
        return aspiranteRepository.findById(id)
            .filter(a -> a.getEstado() == EstadoUsr.ACTIVO)
            .map(aspirante -> {
                // Actualizar campos de Usuario
                if (dto.getNombre() != null) aspirante.setNombre(dto.getNombre());
                if (dto.getCorreo() != null) aspirante.setCorreo(dto.getCorreo());
                if (dto.getTelefono() != null) aspirante.setTelefono(dto.getTelefono());
                if (dto.getFotoPerfilUrl() != null) aspirante.setFotoPerfilUrl(dto.getFotoPerfilUrl());
                
                // Si se proporciona una nueva clave, encriptarla
                if (dto.getClave() != null && !dto.getClave().isEmpty()) {
                    aspirante.setClave(passwordEncoder.encode(dto.getClave()));
                }
                
                // Actualizar campos específicos de UsrAspirante
                if (dto.getApellido() != null) aspirante.setApellido(dto.getApellido());
                if (dto.getResumenProfesional() != null) aspirante.setResumenProfesional(dto.getResumenProfesional());
                if (dto.getFechaNacimiento() != null) aspirante.setFechaNacimiento(dto.getFechaNacimiento());
                
                UsrAspirante actualizado = aspiranteRepository.save(aspirante);
                return aspiranteMapper.toDto(actualizado);
            })
            .orElseThrow(() -> new EntityNotFoundException("Aspirante no encontrado con id: " + id));
    }

    @Override
    public void eliminar(Integer id) {
        aspiranteRepository.deleteById(id);
    }
}
