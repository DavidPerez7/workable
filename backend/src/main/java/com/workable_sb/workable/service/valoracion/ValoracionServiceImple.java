
package com.workable_sb.workable.service.valoracion;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.valoracion.ValoracionDto;
import com.workable_sb.workable.dto.valoracion.ValoracionReadDto;
import com.workable_sb.workable.mapper.valoracion.ValoracionMapper;
import com.workable_sb.workable.models.Valoracion;
import com.workable_sb.workable.repository.ValoracionRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ValoracionServiceImple implements ValoracionService{

  private final ValoracionRepository valoracionRepository;
  private final ValoracionMapper valoracionMapper;

  public ValoracionServiceImple(ValoracionRepository valoracionRepository, ValoracionMapper valoracionMapper){
    this.valoracionRepository = valoracionRepository;
    this.valoracionMapper = valoracionMapper;
  }

  @Override
  public ValoracionReadDto crear(ValoracionDto valoracionDto){
    Valoracion valoracion = valoracionMapper.toEntity(valoracionDto);
  valoracion = Objects.requireNonNull(valoracion, "No se pudo mapear la entidad Valoracion");
  Valoracion creado = valoracionRepository.save(valoracion);
  creado = Objects.requireNonNull(creado, "No se pudo guardar la entidad Valoracion");
    return valoracionMapper.toDto(creado);
  }

  @Override
  public ValoracionReadDto listarId(Integer id){
  Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
  return valoracionRepository.findById(safeId)
    .map(valoracionMapper::toDto)
    .orElseThrow(() -> new EntityNotFoundException("Valoracion no encontrada"));
  }

  @Override
  public List<ValoracionReadDto> listarAll(){
    return valoracionRepository.findAll()
    .stream()
    .map(valoracionMapper::toDto)
    .collect(Collectors.toList());
  }

  @Override
  public void eliminar(Integer id){
  Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
  valoracionRepository.deleteById(safeId);
  }
}
