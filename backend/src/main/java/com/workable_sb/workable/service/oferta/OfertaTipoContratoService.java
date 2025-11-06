package com.workable_sb.workable.service.oferta;

import com.workable_sb.workable.dto.oferta.OfertaTipoContratoCreateDTO;
import com.workable_sb.workable.models.OfertaTipoContrato;
import java.util.List;
import java.util.Optional;

public interface OfertaTipoContratoService {
    List<OfertaTipoContrato> listarTipoContratos();
    Optional<OfertaTipoContrato> obtenerTipoContrato(Integer id);
    OfertaTipoContrato crearTipoContrato(OfertaTipoContratoCreateDTO dto);
    Optional<OfertaTipoContrato> actualizarTipoContrato(Integer id, OfertaTipoContratoCreateDTO dto);
    boolean eliminarTipoContrato(Integer id);
    Optional<OfertaTipoContrato> actualizarEstado(Integer id, OfertaTipoContrato.EstadoTipoContrato estado);
}
