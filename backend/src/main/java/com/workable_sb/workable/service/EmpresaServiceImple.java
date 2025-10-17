package com.workable_sb.workable.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.EmpresaDto;
import com.workable_sb.workable.dto.EmpresaReadDto;
import com.workable_sb.workable.mapper.EmpresaMapper;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.repositories.EmpresaRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class EmpresaServiceImple implements EmpresaService{

  private final EmpresaRepository empresaRepository;
  private final EmpresaMapper empresaMapper;

  public EmpresaServiceImple(EmpresaRepository empresaRepository, EmpresaMapper empresaMapper) {
    this.empresaMapper = empresaMapper;
    this.empresaRepository = empresaRepository;
  }

  @Override
  public EmpresaReadDto guardar(EmpresaDto empresaDto) {
    Empresa empresa = empresaMapper.consultEntity(empresaDto);
    Empresa guardado = empresaRepository.save(empresa);
    return empresaMapper.consultReadDto(guardado);
  }

  @Override
  public EmpresaReadDto listId(Long id) {
    return empresaRepository.findById(id).map(empresaMapper::consultReadDto).orElseThrow(() -> new EntityNotFoundException("empresa no encontrada"));
  }

  @Override
  public List<EmpresaReadDto> listAll() {
    return empresaRepository.findAll().stream().map(empresaMapper::consultReadDto).collect(Collectors.toList());
  }

  @Override
  public void eliminar(Long id) {
    empresaRepository.deleteById(id);
  }
}
