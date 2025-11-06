package com.workable_sb.workable.service.empresa;

import java.util.Objects;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.empresa.EmpresaDto;
import com.workable_sb.workable.mapper.empresa.EmpresaMapper;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.UsrReclutador;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.UsrReclutadorRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class EmpresaServiceImple implements EmpresaService{

  private final EmpresaRepository empresaRepository;
  private final EmpresaMapper empresaMapper;
  private final UsrReclutadorRepository reclutadorRepository;

  public EmpresaServiceImple(EmpresaRepository empresaRepository, EmpresaMapper empresaMapper, 
                               UsrReclutadorRepository reclutadorRepository) {
    this.empresaMapper = empresaMapper;
    this.empresaRepository = empresaRepository;
    this.reclutadorRepository = reclutadorRepository;
  }

  @Override
  public EmpresaDto guardar(EmpresaDto empresaDto) {
    Empresa empresa = empresaMapper.toEntity(empresaDto);
  empresa = Objects.requireNonNull(empresa, "No se pudo mapear la entidad Empresa");
  Empresa guardado = empresaRepository.save(empresa);
  guardado = Objects.requireNonNull(guardado, "No se pudo guardar la entidad Empresa");
    return empresaMapper.toDto(guardado);
  }

  @Override
  public EmpresaDto guardarYVincularReclutador(EmpresaDto empresaDto, String correoReclutador) {
    // Buscar el reclutador por correo
    UsrReclutador reclutador = reclutadorRepository.findByCorreo(correoReclutador)
        .orElseThrow(() -> new EntityNotFoundException("Reclutador no encontrado"));
    
    // Validar que el reclutador no tenga ya una empresa asignada
    if (reclutador.getEmpresa() != null) {
      throw new IllegalStateException("El reclutador ya tiene una empresa registrada");
    }
    
    // Crear la empresa
    Empresa empresa = empresaMapper.toEntity(empresaDto);
  empresa = Objects.requireNonNull(empresa, "No se pudo mapear la entidad Empresa");
  Empresa empresaGuardada = empresaRepository.save(empresa);
  empresaGuardada = Objects.requireNonNull(empresaGuardada, "No se pudo guardar la entidad Empresa");
    
    // Vincular la empresa al reclutador
    reclutador.setEmpresa(empresaGuardada);
    reclutadorRepository.save(reclutador);
    
    return empresaMapper.toDto(empresaGuardada);
  }

  @Override
  public EmpresaDto actualizar(Long id, EmpresaDto empresaDto, String correoReclutador) {
    // Buscar la empresa
  Long safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
  Empresa empresa = empresaRepository.findById(safeId)
    .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));
    
    // Buscar el reclutador autenticado
    UsrReclutador reclutador = reclutadorRepository.findByCorreo(correoReclutador)
        .orElseThrow(() -> new EntityNotFoundException("Reclutador no encontrado"));
    
    // Validar que el reclutador sea el dueño de la empresa
    if (reclutador.getEmpresa() == null || !reclutador.getEmpresa().getNitId().equals(id)) {
      throw new IllegalStateException("No tienes permisos para actualizar esta empresa");
    }
    
    // Actualizar campos
    empresa.setNombre(empresaDto.getNombre());
    empresa.setDescripcion(empresaDto.getDescripcion());
    empresa.setNumeroTrabajadores(empresaDto.getNumeroTrabajadores());
    
    Empresa actualizada = empresaRepository.save(empresa);
    return empresaMapper.toDto(actualizada);
  }

  @Override
  public void eliminar(Long id, String correoReclutador) {
    Long safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
    // Buscar la empresa
    empresaRepository.findById(safeId)
      .orElseThrow(() -> new EntityNotFoundException("Empresa no encontrada"));
    // Buscar el reclutador autenticado
    UsrReclutador reclutador = reclutadorRepository.findByCorreo(correoReclutador)
      .orElseThrow(() -> new EntityNotFoundException("Reclutador no encontrado"));
    // Validar que el reclutador sea el dueño de la empresa
    if (reclutador.getEmpresa() == null || !reclutador.getEmpresa().getNitId().equals(id)) {
      throw new IllegalStateException("No tienes permisos para eliminar esta empresa");
    }
    // Desvincular el reclutador antes de eliminar
    reclutador.setEmpresa(null);
    reclutadorRepository.save(reclutador);
    // Eliminar la empresa
    empresaRepository.deleteById(safeId);
  }

  @Override
  public EmpresaDto listId(Long id) {
  Long safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
  return empresaRepository.findById(safeId).map(empresaMapper::toDto).orElseThrow(() -> new EntityNotFoundException("empresa no encontrada"));
  }

  @Override
  public List<EmpresaDto> listAll() {
    return empresaRepository.findAll().stream().map(empresaMapper::toDto).collect(Collectors.toList());
  }
}
