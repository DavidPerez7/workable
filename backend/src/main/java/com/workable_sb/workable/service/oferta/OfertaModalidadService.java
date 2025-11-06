package com.workable_sb.workable.service.oferta;

import com.workable_sb.workable.dto.oferta.OfertaModalidadCreateDTO;
import com.workable_sb.workable.models.OfertaModalidad;
import java.util.List;
import java.util.Optional;

public interface OfertaModalidadService {
    List<OfertaModalidad> listarModalidades();
    Optional<OfertaModalidad> obtenerModalidad(Integer id);
    OfertaModalidad crearModalidad(OfertaModalidadCreateDTO dto);
    Optional<OfertaModalidad> actualizarModalidad(Integer id, OfertaModalidadCreateDTO dto);
    boolean eliminarModalidad(Integer id);
    Optional<OfertaModalidad> actualizarEstado(Integer id, OfertaModalidad.EstadoModalidad estado);
}
