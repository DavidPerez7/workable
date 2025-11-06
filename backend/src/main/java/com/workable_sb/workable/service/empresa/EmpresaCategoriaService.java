package com.workable_sb.workable.service.empresa;

import com.workable_sb.workable.dto.empresa.EmpresaCategoriaCreateDTO;
import com.workable_sb.workable.dto.empresa.EmpresaCategoriaReadDTO;
import com.workable_sb.workable.models.EmpresaCategoria;

import java.util.List;

public interface EmpresaCategoriaService {
    EmpresaCategoriaReadDTO create(EmpresaCategoriaCreateDTO dto);
    EmpresaCategoriaReadDTO update(Integer id, EmpresaCategoriaCreateDTO dto);
    void delete(Integer id);
    EmpresaCategoriaReadDTO findById(Integer id);
    List<EmpresaCategoriaReadDTO> findAll();
    EmpresaCategoriaReadDTO changeEstado(Integer id, EmpresaCategoria.EstadoCategoria estado);
}
