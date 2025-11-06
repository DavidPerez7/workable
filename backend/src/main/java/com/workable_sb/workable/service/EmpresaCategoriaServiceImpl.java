package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.EmpresaCategoriaDto;
import com.workable_sb.workable.mapper.EmpresaCategoriaMapperImpl;
import com.workable_sb.workable.models.EmpresaCategoria;
import com.workable_sb.workable.repository.EmpresaCategoriaRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmpresaCategoriaServiceImpl implements EmpresaCategoriaService {
    private final EmpresaCategoriaRepository repo;
    private final EmpresaCategoriaMapperImpl mapper = new EmpresaCategoriaMapperImpl();

    public EmpresaCategoriaServiceImpl(EmpresaCategoriaRepository repo) {
        this.repo = repo;
    }

    @Override
    public EmpresaCategoriaDto create(EmpresaCategoriaDto dto) {
        EmpresaCategoria entity = mapper.toEntity(dto);
        return mapper.toDto(repo.save(entity));
    }

    @Override
    public EmpresaCategoriaDto update(Integer id, EmpresaCategoriaDto dto) {
        EmpresaCategoria entity = repo.findById(id).orElseThrow();
        entity.setNombre(dto.getNombre());
        entity.setImagenUrl(dto.getImagenUrl());
        entity.setDescripcion(dto.getDescripcion());
        return mapper.toDto(repo.save(entity));
    }

    @Override
    public void delete(Integer id) {
        repo.deleteById(id);
    }

    @Override
    public EmpresaCategoriaDto findById(Integer id) {
        return repo.findById(id).map(mapper::toDto).orElse(null);
    }

    @Override
    public List<EmpresaCategoriaDto> findAll() {
        return repo.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }
}
