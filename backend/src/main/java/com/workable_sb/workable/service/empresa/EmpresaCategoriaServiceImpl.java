package com.workable_sb.workable.service.empresa;

import com.workable_sb.workable.dto.empresa.EmpresaCategoriaCreateDTO;
import com.workable_sb.workable.dto.empresa.EmpresaCategoriaReadDTO;
import com.workable_sb.workable.mapper.empresa.EmpresaCategoriaMapper;
import com.workable_sb.workable.models.EmpresaCategoria;
import com.workable_sb.workable.repository.EmpresaCategoriaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpresaCategoriaServiceImpl implements EmpresaCategoriaService {
    private final EmpresaCategoriaRepository repository;
    private final EmpresaCategoriaMapper mapper;

    @Override
    public EmpresaCategoriaReadDTO create(EmpresaCategoriaCreateDTO dto) {
        Objects.requireNonNull(dto, "El DTO no puede ser nulo");
        
        EmpresaCategoria entity = mapper.toEntity(dto);
        EmpresaCategoria guardado = repository.save(entity);
        
        return mapper.toDto(guardado);
    }

    @Override
    public EmpresaCategoriaReadDTO update(Integer id, EmpresaCategoriaCreateDTO dto) {
        Objects.requireNonNull(id, "El id no puede ser nulo");
        Objects.requireNonNull(dto, "El DTO no puede ser nulo");
        
        EmpresaCategoria entity = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con id: " + id));
        
        entity.setNombre(dto.getNombre() != null ? dto.getNombre().trim() : entity.getNombre());
        entity.setImagenUrl(dto.getImagenUrl() != null ? dto.getImagenUrl().trim() : entity.getImagenUrl());
        entity.setDescripcion(dto.getDescripcion() != null ? dto.getDescripcion().trim() : entity.getDescripcion());
        
        if (dto.getEstado() != null) {
            entity.setEstado(dto.getEstado());
        }
        
        EmpresaCategoria actualizado = repository.save(entity);
        return mapper.toDto(actualizado);
    }

    @Override
    public void delete(Integer id) {
        Objects.requireNonNull(id, "El id no puede ser nulo");
        
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Categoría no encontrada con id: " + id);
        }
        
        repository.deleteById(id);
    }

    @Override
    public EmpresaCategoriaReadDTO findById(Integer id) {
        Objects.requireNonNull(id, "El id no puede ser nulo");
        
        return repository.findById(id)
            .map(mapper::toDto)
            .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con id: " + id));
    }

    @Override
    public List<EmpresaCategoriaReadDTO> findAll() {
        return repository.findAll()
            .stream()
            .map(mapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public EmpresaCategoriaReadDTO changeEstado(Integer id, EmpresaCategoria.EstadoCategoria estado) {
        Objects.requireNonNull(id, "El id no puede ser nulo");
        Objects.requireNonNull(estado, "El estado no puede ser nulo");
        
        EmpresaCategoria entity = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con id: " + id));
        
        entity.setEstado(estado);
        EmpresaCategoria actualizado = repository.save(entity);
        
        return mapper.toDto(actualizado);
    }
}
