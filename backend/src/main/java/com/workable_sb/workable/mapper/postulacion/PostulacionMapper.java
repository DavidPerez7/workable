package com.workable_sb.workable.mapper.postulacion;

import com.workable_sb.workable.dto.postulacion.PostulacionDto;
import com.workable_sb.workable.models.Postulacion;

public interface PostulacionMapper {
  Postulacion toEntity(PostulacionDto postulacionDto);
  PostulacionDto toDto(Postulacion entity);
}
