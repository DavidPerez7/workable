package com.workable_sb.workable.service;

import java.util.List;

import com.workable_sb.workable.dto.InfoAspiranteDto;

public interface InfoPersonalService {
    InfoAspiranteDto crearyupdate(InfoAspiranteDto infoPersonalDto);

    List<InfoAspiranteDto> listPersonal();

    void eliminarPersonal(Integer infoPersonal_id);

    InfoAspiranteDto buscarporId(Integer infoPersonal_id);
}
