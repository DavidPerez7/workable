package com.workable_sb.workable.service;

import java.util.List;

import com.workable_sb.workable.dto.OfertaDto;

public interface OfertaService {
    OfertaDto guardar(OfertaDto ofertaDto);
    OfertaDto guardarYVincularReclutador(OfertaDto ofertaDto, String correoReclutador);
    OfertaDto actualizar(Integer id, OfertaDto ofertaDto, String correoReclutador);
    OfertaDto ListId(Integer id);
    List<OfertaDto> listarAll();
    void eliminar(Integer id, String correoReclutador);
}
