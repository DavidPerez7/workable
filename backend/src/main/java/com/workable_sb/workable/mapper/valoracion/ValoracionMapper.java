package com.workable_sb.workable.mapper.valoracion;

import com.workable_sb.workable.dto.valoracion.ValoracionDto;
import com.workable_sb.workable.dto.valoracion.ValoracionReadDto;
import com.workable_sb.workable.models.Valoracion;

public interface ValoracionMapper {
  Valoracion toEntity(ValoracionDto valoracionDto);
  ValoracionReadDto toDto(Valoracion entity);
}
