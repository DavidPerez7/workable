package com.workable_sb.workable.service.postulacion;

import java.util.Objects;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.postulacion.PostulacionDto;
import com.workable_sb.workable.mapper.postulacion.PostulacionMapper;
import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.repository.PostulacionRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PostulacionServiceImple implements PostulacionService{

  private final PostulacionRepository postulacionRepository;
  private final PostulacionMapper postulacionMapper;

  public PostulacionServiceImple(PostulacionRepository postulacionRepository, PostulacionMapper postulacionMapper){
    this.postulacionRepository = postulacionRepository;
    this.postulacionMapper = postulacionMapper;
  }

  @Override
  public PostulacionDto crear(PostulacionDto postulacionDto){
    Postulacion postulacion = postulacionMapper.toEntity(postulacionDto);
  postulacion = Objects.requireNonNull(postulacion, "No se pudo mapear la entidad Postulacion");
  Postulacion creacion = postulacionRepository.save(postulacion);
  creacion = Objects.requireNonNull(creacion, "No se pudo guardar la entidad Postulacion");
    return postulacionMapper.toDto(creacion);
  }

  @Override
  public PostulacionDto listId(Integer id){
  Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
  return postulacionRepository.findById(safeId)
  .map(postulacionMapper::toDto)
  .orElseThrow(() -> new EntityNotFoundException("Postulacion no encontrada"));
  }

  @Override
  public List<PostulacionDto> listarAll(){
    return postulacionRepository.findAll()
    .stream()
    .map(postulacionMapper::toDto)
    .collect(Collectors.toList());
  }

  @Override
  public void eliminar(Integer id){
  Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
  postulacionRepository.deleteById(safeId);
  }
}
