package com.workable_sb.workable.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.ValoracionDto;
import com.workable_sb.workable.dto.ValoracionReadDto;
import com.workable_sb.workable.mapper.ValoracionMapper;
import com.workable_sb.workable.models.Valoracion;
import com.workable_sb.workable.repositories.ValoracionRepository;

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
    Valoracion valoracion = valoracionMapper.consult(valoracionDto);
    Valoracion creado = valoracionRepository.save(valoracion);
    return valoracionMapper.consultReadDto(creado);
  }

  @Override
  public ValoracionReadDto listarId(Integer id){
    return valoracionRepository.findById(id)
    .map(valoracionMapper:: consultReadDto)
    .orElseThrow(() -> new EntityNotFoundException("Valoracion no encontrada"));
  }

  @Override
  public List<ValoracionReadDto> listarAll(){
    return valoracionRepository.findAll()
    .stream()
    .map(valoracionMapper:: consultReadDto)
    .collect(Collectors.toList());
  }

  @Override
  public void eliminar(Integer id){
    valoracionRepository.deleteById(id);
  }
}
