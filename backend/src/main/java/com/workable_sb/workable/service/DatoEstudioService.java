package com.workable_sb.workable.service;

import java.util.List;

import com.workable_sb.workable.dto.DatoEstudioDto;

public interface DatoEstudioService {
    DatoEstudioDto crearyupdate(DatoEstudioDto datoEstudioDto);

    DatoEstudioDto buscarPorId(Integer Est_id);

    List<DatoEstudioDto> listarTodos();

    void eliminar(Integer Est_id);

}
