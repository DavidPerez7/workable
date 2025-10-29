package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.UsrReclutadorDto;
import com.workable_sb.workable.dto.UsrReclutadorReadDto;
import java.util.List;

public interface UsrReclutadorService {
    UsrReclutadorDto crear(UsrReclutadorDto dto);
    UsrReclutadorReadDto buscarPorId(Integer id);  // Sin clave
    List<UsrReclutadorReadDto> listarTodos();  // Sin clave
    UsrReclutadorDto actualizar(Integer id, UsrReclutadorDto dto);
    void eliminar(Integer id);
}
