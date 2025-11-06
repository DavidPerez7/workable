package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.NivelEducativoCreateDto;
import com.workable_sb.workable.dto.NivelEducativoDto;
import java.util.List;

public interface NivelEducativoService {
    NivelEducativoDto create(NivelEducativoCreateDto dto);
    List<NivelEducativoDto> findAll();
        NivelEducativoDto update(Integer id, NivelEducativoDto dto);
        void delete(Integer id);
        NivelEducativoDto findById(Integer id);
        NivelEducativoDto changeEstado(Integer id, String estado);
}
