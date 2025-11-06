package com.workable_sb.workable.service.oferta;

import com.workable_sb.workable.dto.oferta.OfertaModalidadCreateDTO;
import com.workable_sb.workable.mapper.oferta.OfertaModalidadMapper;
import com.workable_sb.workable.models.OfertaModalidad;
import com.workable_sb.workable.repository.OfertaModalidadRepository;

import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OfertaModalidadServiceImple implements OfertaModalidadService {
    private final OfertaModalidadRepository modalidadRepository;
    private final OfertaModalidadMapper mapper;

    @Override
    public List<OfertaModalidad> listarModalidades() {
        return modalidadRepository.findAll();
    }

    @Override
    public Optional<OfertaModalidad> obtenerModalidad(Integer id) {
        Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
        return modalidadRepository.findById(safeId);
    }

    @Override
    public OfertaModalidad crearModalidad(OfertaModalidadCreateDTO dto) {
        OfertaModalidad modalidad = mapper.toEntity(dto);
        modalidad = java.util.Objects.requireNonNull(modalidad, "No se pudo mapear el DTO a entidad OfertaModalidad");
        return modalidadRepository.save(modalidad);
    }

    @Override
    public Optional<OfertaModalidad> actualizarModalidad(Integer id, OfertaModalidadCreateDTO dto) {
        Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
        return modalidadRepository.findById(safeId).map(m -> {
            m.setNombre(dto.getNombre().trim());
            if (dto.getEstado() != null) {
                m.setEstado(dto.getEstado());
            }
            return modalidadRepository.save(m);
        });
    }

    @Override
    public boolean eliminarModalidad(Integer id) {
        Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
        if (!modalidadRepository.existsById(safeId)) {
            return false;
        }
        modalidadRepository.deleteById(safeId);
        return true;
    }

    @Override
    public Optional<OfertaModalidad> actualizarEstado(Integer id, OfertaModalidad.EstadoModalidad estado) {
        Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
        return modalidadRepository.findById(safeId).map(m -> {
            m.setEstado(estado);
            return modalidadRepository.save(m);
        });
    }
}
