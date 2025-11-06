package com.workable_sb.workable.service.nivelEducativo;

import java.util.Objects;

import com.workable_sb.workable.dto.nivelEducativo.NivelEducativoCreateDto;
import com.workable_sb.workable.dto.nivelEducativo.NivelEducativoDto;
import com.workable_sb.workable.mapper.nivelEducativo.NivelEducativoMapper;
import com.workable_sb.workable.models.NivelEducativo;
import com.workable_sb.workable.repository.NivelEducativoRepository;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NivelEducativoServiceImpl implements NivelEducativoService {
    private final NivelEducativoRepository repo;
    private final NivelEducativoMapper mapper;

    public NivelEducativoServiceImpl(NivelEducativoRepository repo, NivelEducativoMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    @Override
    public NivelEducativoDto create(NivelEducativoCreateDto dto) {
        NivelEducativo nivel = new NivelEducativo();
        nivel.setNombre(dto.getNombre());
    nivel.setEstado(NivelEducativo.Estado.ACTIVO);
        return mapper.toDto(repo.save(nivel));
    }
    @Override
    public NivelEducativoDto update(Integer id, NivelEducativoDto dto) {
        Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
        NivelEducativo nivel = repo.findById(safeId).orElseThrow();
        nivel.setNombre(dto.getNombre());
        nivel.setEstado(dto.getEstado());
        nivel = Objects.requireNonNull(nivel, "No se pudo mapear la entidad NivelEducativo");
        NivelEducativo guardado = repo.save(nivel);
        guardado = Objects.requireNonNull(guardado, "No se pudo guardar la entidad NivelEducativo");
        return mapper.toDto(guardado);
    }
    @Override
    public void delete(Integer id) {
        Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
        repo.deleteById(safeId);
    }
    @Override
    public NivelEducativoDto findById(Integer id) {
        Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
        return repo.findById(safeId).map(mapper::toDto).orElse(null);
    }
    @Override
    public List<NivelEducativoDto> findAll() {
        return repo.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }
    @Override
    public NivelEducativoDto changeEstado(Integer id, String estado) {
        Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
        NivelEducativo nivel = repo.findById(safeId).orElseThrow();
        nivel.setEstado(NivelEducativo.Estado.valueOf(estado));
        nivel = Objects.requireNonNull(nivel, "No se pudo mapear la entidad NivelEducativo");
        NivelEducativo guardado = repo.save(nivel);
        guardado = Objects.requireNonNull(guardado, "No se pudo guardar la entidad NivelEducativo");
        return mapper.toDto(guardado);
    }
}
