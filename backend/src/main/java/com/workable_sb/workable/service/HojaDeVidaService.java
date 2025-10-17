package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.HojaDeVidaDto;
import java.util.List;

public interface HojaDeVidaService {
    HojaDeVidaDto crearHojaDeVida(HojaDeVidaDto hojaDeVidaDto);
    HojaDeVidaDto obtenerHojaDeVidaPorId(Integer id);
    List<HojaDeVidaDto> listarHojasDeVidaPorAspirante(Integer aspiranteId);
    HojaDeVidaDto actualizarHojaDeVida(Integer id, HojaDeVidaDto hojaDeVidaDto);
    void eliminarHojaDeVida(Integer id);
}
