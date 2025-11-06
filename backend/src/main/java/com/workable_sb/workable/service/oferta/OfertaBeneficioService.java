
package com.workable_sb.workable.service.oferta;


import com.workable_sb.workable.dto.oferta.OfertaBeneficioCreateDTO;
import com.workable_sb.workable.models.OfertaBeneficio;
import com.workable_sb.workable.models.OfertaBeneficio.EstadoBeneficio;
import java.util.List;


public interface OfertaBeneficioService {
    List<OfertaBeneficio> listarBeneficios();
    OfertaBeneficio obtenerBeneficio(Short id);
    OfertaBeneficio crearBeneficio(OfertaBeneficioCreateDTO dto);
    OfertaBeneficio actualizarBeneficio(Short id, OfertaBeneficioCreateDTO dto);
    void eliminarBeneficio(Short id);
    OfertaBeneficio actualizarEstado(Short id, EstadoBeneficio estado);
}
