package com.workable_sb.workable.service;

import java.util.List;

import com.workable_sb.workable.dto.DataEstudioDto;

public interface DatoEstudioService {
    DataEstudioDto crearyupdate(DataEstudioDto datoDataEstudioDto);

    DataEstudioDto buscarPorId(Integer Est_id);

    List<DataEstudioDto> listarTodos();

    void eliminar(Integer Est_id);

}
