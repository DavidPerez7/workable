package com.workable_sb.workable.service.oferta;

import com.workable_sb.workable.dto.oferta.OfertaCreateDTO;
import com.workable_sb.workable.dto.oferta.OfertaReadDTO;
import com.workable_sb.workable.mapper.oferta.OfertaMapper;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.repository.OfertaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfertaServiceImple implements OfertaService {
    private final OfertaRepository repository;
    private final OfertaMapper mapper;

    @Override
    public OfertaReadDTO create(OfertaCreateDTO dto) {
        Objects.requireNonNull(dto, "El DTO no puede ser nulo");
        
        Oferta entity = mapper.toEntity(dto);
        Oferta guardado = repository.save(entity);
        
        return mapper.toDto(guardado);
    }

    @Override
    public OfertaReadDTO update(Integer id, OfertaCreateDTO dto) {
        Objects.requireNonNull(id, "El id no puede ser nulo");
        Objects.requireNonNull(dto, "El DTO no puede ser nulo");
        
        Oferta entity = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada con id: " + id));
        
        entity.setTitulo(dto.getTitulo() != null ? dto.getTitulo().trim() : entity.getTitulo());
        entity.setDescripcion(dto.getDescripcion() != null ? dto.getDescripcion().trim() : entity.getDescripcion());
        entity.setUbicacion(dto.getUbicacion() != null ? dto.getUbicacion().trim() : entity.getUbicacion());
        entity.setFechaLimite(dto.getFechaLimite() != null ? dto.getFechaLimite() : entity.getFechaLimite());
        entity.setSalario(dto.getSalario() != null ? dto.getSalario() : entity.getSalario());
        
        if (dto.getEstado() != null) {
            entity.setEstado(dto.getEstado());
        }
        
        if (dto.getRequisitos() != null) {
            entity.setRequisitos(dto.getRequisitos());
        }
        
        Oferta actualizado = repository.save(entity);
        return mapper.toDto(actualizado);
    }

    @Override
    public void delete(Integer id) {
        Objects.requireNonNull(id, "El id no puede ser nulo");
        
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Oferta no encontrada con id: " + id);
        }
        
        repository.deleteById(id);
    }

    @Override
    public OfertaReadDTO findById(Integer id) {
        Objects.requireNonNull(id, "El id no puede ser nulo");
        
        return repository.findById(id)
            .map(mapper::toDto)
            .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada con id: " + id));
    }

    @Override
    public List<OfertaReadDTO> findAll() {
        return repository.findAll()
            .stream()
            .map(mapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public OfertaReadDTO changeEstado(Integer id, Oferta.EstadoOferta estado) {
        Objects.requireNonNull(id, "El id no puede ser nulo");
        Objects.requireNonNull(estado, "El estado no puede ser nulo");
        
        Oferta entity = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Oferta no encontrada con id: " + id));
        
        entity.setEstado(estado);
        Oferta actualizado = repository.save(entity);
        
        return mapper.toDto(actualizado);
    }
}
