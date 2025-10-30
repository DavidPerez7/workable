package com.workable_sb.workable.service;

import java.util.List;

import com.workable_sb.workable.dto.OfertaDto;

public interface OfertaService {
    OfertaDto guardar(OfertaDto ofertaDto);
    OfertaDto ListId(Integer id);
    List<OfertaDto> listarAll();
    void eliminar(Integer id);
}
