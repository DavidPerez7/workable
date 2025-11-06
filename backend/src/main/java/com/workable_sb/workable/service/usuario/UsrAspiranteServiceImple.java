package com.workable_sb.workable.service.usuario;

import java.util.Objects;

import com.workable_sb.workable.dto.usuario.UsrAspiranteDto;
import com.workable_sb.workable.dto.usuario.UsrAspiranteReadDto;
import com.workable_sb.workable.mapper.usuario.UsrAspiranteMapper;
import com.workable_sb.workable.models.UsrAspirante;
import com.workable_sb.workable.models.Usuario.EstadoUsr;
import com.workable_sb.workable.repository.UsrAspiranteRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UsrAspiranteServiceImple implements UsrAspiranteService {
    
    private final UsrAspiranteRepository aspiranteRepository;
    private final UsrAspiranteMapper aspiranteMapper;
    
    private final PasswordEncoder passwordEncoder;

    public UsrAspiranteServiceImple(UsrAspiranteRepository aspiranteRepository, 
                                    UsrAspiranteMapper aspiranteMapper,
                                    PasswordEncoder passwordEncoder) {
        this.aspiranteRepository = aspiranteRepository;
        this.aspiranteMapper = aspiranteMapper;
        this.passwordEncoder = passwordEncoder;
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
    Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
    return aspiranteRepository.findById(safeId)
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
    Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
    return aspiranteRepository.findById(safeId)
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
                
                aspirante = Objects.requireNonNull(aspirante, "No se pudo mapear la entidad UsrAspirante");
                UsrAspirante actualizado = aspiranteRepository.save(aspirante);
                actualizado = Objects.requireNonNull(actualizado, "No se pudo guardar la entidad UsrAspirante");
                return aspiranteMapper.toDto(actualizado);
            })
            .orElseThrow(() -> new EntityNotFoundException("Aspirante no encontrado con id: " + id));
    }

    @Override
    public void eliminar(Integer id) {
    Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
    aspiranteRepository.deleteById(safeId);
    }
}
