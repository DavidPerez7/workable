package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.UsrAspiranteDto;
import com.workable_sb.workable.dto.UsrAspiranteReadDto;
import java.util.List;

public interface UsrAspiranteService {
    UsrAspiranteDto crear(UsrAspiranteDto dto);
    UsrAspiranteReadDto buscarPorId(Integer id);  // Sin clave
    List<UsrAspiranteReadDto> listarTodos();  // Sin clave
    UsrAspiranteDto actualizar(Integer id, UsrAspiranteDto dto);
    void eliminar(Integer id);
}
