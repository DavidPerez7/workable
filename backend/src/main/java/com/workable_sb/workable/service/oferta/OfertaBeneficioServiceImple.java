package com.workable_sb.workable.service.oferta;

import com.workable_sb.workable.dto.oferta.OfertaBeneficioCreateDTO;
import com.workable_sb.workable.mapper.oferta.OfertaBeneficioMapper;
import com.workable_sb.workable.models.OfertaBeneficio;
import com.workable_sb.workable.models.OfertaBeneficio.EstadoBeneficio;
import com.workable_sb.workable.repository.OfertaBeneficioRepository;
import lombok.RequiredArgsConstructor;
import java.util.Objects;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfertaBeneficioServiceImple implements OfertaBeneficioService {
    private final @NonNull OfertaBeneficioRepository beneficioRepository;
    private final @NonNull OfertaBeneficioMapper mapper;

    @Override
    public List<OfertaBeneficio> listarBeneficios() {
        return beneficioRepository.findAll();
    }

    @Override
    public OfertaBeneficio obtenerBeneficio(Short id) {
        Short safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
        return beneficioRepository.findById(safeId)
            .orElseThrow(() -> new RuntimeException("Beneficio no encontrado con id: " + id));
    }

    @Override
    @Transactional
    public OfertaBeneficio crearBeneficio(OfertaBeneficioCreateDTO dto) {
        OfertaBeneficio beneficio = mapper.toEntity(dto);
        if (beneficio == null) {
            throw new IllegalArgumentException("No se pudo mapear el DTO a entidad OfertaBeneficio");
        }
        return beneficioRepository.save(beneficio);
    }

    @Override
    @Transactional
    public OfertaBeneficio actualizarBeneficio(Short id, OfertaBeneficioCreateDTO dto) {
        OfertaBeneficio beneficio = obtenerBeneficio(id);
        if (beneficio == null) {
            throw new RuntimeException("Beneficio no encontrado con id: " + id);
        }
        beneficio.setNombre(dto.getNombre());
        beneficio.setEstado(dto.getEstado());
        return beneficioRepository.save(beneficio);
    }

    @Override
    @Transactional
    public void eliminarBeneficio(Short id) {
        OfertaBeneficio beneficio = obtenerBeneficio(id);
        if (beneficio == null) {
            throw new RuntimeException("Beneficio no encontrado con id: " + id);
        }
        beneficioRepository.delete(beneficio);
    }

    @Override
    @Transactional
    public OfertaBeneficio actualizarEstado(Short id, EstadoBeneficio estado) {
        OfertaBeneficio beneficio = obtenerBeneficio(id);
        if (beneficio == null) {
            throw new RuntimeException("Beneficio no encontrado con id: " + id);
        }
        beneficio.setEstado(estado);
        return beneficioRepository.save(beneficio);
    }
}
