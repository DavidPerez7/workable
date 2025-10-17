package com.workable_sb.workable.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.PostulacionDto;
import com.workable_sb.workable.mapper.PostulacionMapper;
import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.repositories.PostulacionRepository;

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
    Postulacion postulacion = postulacionMapper.consult(postulacionDto);
    Postulacion creacion = postulacionRepository.save(postulacion);
    return postulacionMapper.consultDto(creacion);
  }

  @Override
  public PostulacionDto listId(Integer id){
  return postulacionRepository.findById(id)
  .map(postulacionMapper::consultDto)
  .orElseThrow(() -> new EntityNotFoundException("Postulacion no encontrada"));
  }

  @Override
  public List<PostulacionDto> listarAll(){
    return postulacionRepository.findAll()
    .stream()
    .map(postulacionMapper:: consultDto)
    .collect(Collectors.toList());
  }

  @Override
  public void eliminar(Integer id){
    postulacionRepository.deleteById(id);
  }
}
