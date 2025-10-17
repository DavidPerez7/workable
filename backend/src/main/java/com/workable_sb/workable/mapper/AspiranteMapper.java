package com.workable_sb.workable.mapper;

import com.workable_sb.workable.dto.AspiranteDto;
import com.workable_sb.workable.dto.AspiranteReadDto;
import com.workable_sb.workable.models.Aspirante;

public interface AspiranteMapper {
  Aspirante consult(AspiranteDto aspiranteDto);
  AspiranteReadDto consultReadDto(Aspirante entity);
}
