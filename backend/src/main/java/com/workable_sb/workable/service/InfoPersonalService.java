package com.workable_sb.workable.service;

import java.util.List;

import com.workable_sb.workable.dto.InfoPersonalDto;

public interface InfoPersonalService {
    InfoPersonalDto crearyupdate(InfoPersonalDto infoPersonalDto);

    List<InfoPersonalDto> listPersonal();

    void eliminarPersonal(Integer infoPersonal_id);

    InfoPersonalDto buscarporId(Integer infoPersonal_id);
}
