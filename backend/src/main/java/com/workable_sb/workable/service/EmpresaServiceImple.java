package com.workable_sb.workable.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.EmpresaDto;
import com.workable_sb.workable.mapper.EmpresaMapper;
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
    Empresa guardado = empresaRepository.save(empresa);
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
    Empresa empresaGuardada = empresaRepository.save(empresa);
    
    // Vincular la empresa al reclutador
    reclutador.setEmpresa(empresaGuardada);
    reclutadorRepository.save(reclutador);
    
    return empresaMapper.toDto(empresaGuardada);
  }

  @Override
  public EmpresaDto actualizar(Long id, EmpresaDto empresaDto, String correoReclutador) {
    // Buscar la empresa
    Empresa empresa = empresaRepository.findById(id)
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
    // Buscar la empresa
    Empresa empresa = empresaRepository.findById(id)
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
    empresaRepository.deleteById(id);
  }

  @Override
  public EmpresaDto listId(Long id) {
    return empresaRepository.findById(id).map(empresaMapper::toDto).orElseThrow(() -> new EntityNotFoundException("empresa no encontrada"));
  }

  @Override
  public List<EmpresaDto> listAll() {
    return empresaRepository.findAll().stream().map(empresaMapper::toDto).collect(Collectors.toList());
  }
}
