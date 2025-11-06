package com.workable_sb.workable.service.usuario;

import com.workable_sb.workable.dto.usuario.UsrReclutadorDto;
import com.workable_sb.workable.dto.usuario.UsrReclutadorReadDto;

import java.util.List;

public interface UsrReclutadorService {
    UsrReclutadorDto crear(UsrReclutadorDto dto);
    UsrReclutadorReadDto buscarPorId(Integer id);  // Sin clave
    List<UsrReclutadorReadDto> listarTodos();  // Sin clave
    List<UsrReclutadorReadDto> listarPorEmpresa(Long empresaId); // Sin clave
    UsrReclutadorDto actualizar(Integer id, UsrReclutadorDto dto);
    void eliminar(Integer id);
}
