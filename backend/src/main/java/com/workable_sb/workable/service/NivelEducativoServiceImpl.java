package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.NivelEducativoCreateDto;
import com.workable_sb.workable.dto.NivelEducativoDto;
import com.workable_sb.workable.mapper.NivelEducativoMapper;
import com.workable_sb.workable.models.NivelEducativo;
import com.workable_sb.workable.repository.NivelEducativoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NivelEducativoServiceImpl implements NivelEducativoService {
    private final NivelEducativoRepository repo;
    public NivelEducativoServiceImpl(NivelEducativoRepository repo) {
        this.repo = repo;
    }
    @Override
    public NivelEducativoDto create(NivelEducativoCreateDto dto) {
        NivelEducativo nivel = new NivelEducativo();
        nivel.setNombre(dto.getNombre());
    nivel.setEstado(NivelEducativo.Estado.ACTIVO);
        return NivelEducativoMapper.toDto(repo.save(nivel));
    }
    @Override
    public NivelEducativoDto update(Integer id, NivelEducativoDto dto) {
    NivelEducativo nivel = repo.findById(id).orElseThrow();
        nivel.setNombre(dto.getNombre());
    nivel.setEstado(dto.getEstado());
        return NivelEducativoMapper.toDto(repo.save(nivel));
    }
    @Override
    public void delete(Integer id) {
    repo.deleteById(id);
    }
    @Override
    public NivelEducativoDto findById(Integer id) {
    return repo.findById(id).map(NivelEducativoMapper::toDto).orElse(null);
    }
    @Override
    public List<NivelEducativoDto> findAll() {
        return repo.findAll().stream().map(NivelEducativoMapper::toDto).collect(Collectors.toList());
    }
    @Override
    public NivelEducativoDto changeEstado(Integer id, String estado) {
    NivelEducativo nivel = repo.findById(id).orElseThrow();
    nivel.setEstado(NivelEducativo.Estado.valueOf(estado));
    return NivelEducativoMapper.toDto(repo.save(nivel));
    }
}
