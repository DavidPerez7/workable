package com.workable_sb.workable.service;

import java.util.List;

import com.workable_sb.workable.dto.PostulacionDto;

public interface PostulacionService {
  PostulacionDto crear(PostulacionDto postulacionDto);
  PostulacionDto listId(Integer id);
  List<PostulacionDto> listarAll();
  void eliminar(Integer id);
}
