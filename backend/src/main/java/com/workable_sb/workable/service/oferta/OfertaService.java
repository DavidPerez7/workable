package com.workable_sb.workable.service.oferta;

import com.workable_sb.workable.dto.oferta.OfertaCreateDTO;
import com.workable_sb.workable.dto.oferta.OfertaReadDTO;
import com.workable_sb.workable.models.Oferta;

import java.util.List;

public interface OfertaService {
    OfertaReadDTO create(OfertaCreateDTO dto);
    OfertaReadDTO update(Integer id, OfertaCreateDTO dto);
    void delete(Integer id);
    OfertaReadDTO findById(Integer id);
    List<OfertaReadDTO> findAll();
    OfertaReadDTO changeEstado(Integer id, Oferta.EstadoOferta estado);
}
