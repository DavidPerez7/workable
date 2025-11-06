package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.EmpresaCategoriaDto;
import java.util.List;

public interface EmpresaCategoriaService {
    EmpresaCategoriaDto create(EmpresaCategoriaDto dto);
    EmpresaCategoriaDto update(Integer id, EmpresaCategoriaDto dto);
    void delete(Integer id);
    EmpresaCategoriaDto findById(Integer id);
    List<EmpresaCategoriaDto> findAll();
}
