package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.PostulacionDto;
import com.workable_sb.workable.models.Postulacion;

public interface PostulacionMapper {
  Postulacion consult(PostulacionDto postulacionDto);
  PostulacionDto consultDto(Postulacion entity);
}
