package com.workable_sb.workable.service;

import java.util.List;

import com.workable_sb.workable.dto.EstudioDto;

public interface DatoEstudioService {
    EstudioDto crearyupdate(EstudioDto datoEstudioDto);

    EstudioDto buscarPorId(Integer Est_id);

    List<EstudioDto> listarTodos();

    void eliminar(Integer Est_id);

}
