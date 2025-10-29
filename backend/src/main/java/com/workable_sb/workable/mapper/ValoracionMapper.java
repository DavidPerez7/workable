package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.ValoracionDto;
import com.workable_sb.workable.dto.ValoracionReadDto;
import com.workable_sb.workable.models.Valoracion;

public interface ValoracionMapper {
  Valoracion toEntity(ValoracionDto valoracionDto);
  ValoracionReadDto toDto(Valoracion entity);
}
