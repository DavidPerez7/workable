package com.workable_sb.workable.service.postulacion;

import java.util.List;

import com.workable_sb.workable.dto.postulacion.PostulacionDto;

public interface PostulacionService {
  PostulacionDto crear(PostulacionDto postulacionDto);
  PostulacionDto listId(Integer id);
  List<PostulacionDto> listarAll();
  void eliminar(Integer id);
}
