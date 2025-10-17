package com.workable_sb.workable.service;

import java.util.List;

import com.workable_sb.workable.dto.ReclutadorDto;
import com.workable_sb.workable.dto.ReclutadorReadDto;

public interface ReclutadorService {
    ReclutadorReadDto crearyupdate(ReclutadorDto reclutadorDto);
    List<ReclutadorReadDto> listarTodos();
    ReclutadorReadDto buscarPorId(Integer reclutador_id);
    void eliminar(Integer reclutador_id);
}
