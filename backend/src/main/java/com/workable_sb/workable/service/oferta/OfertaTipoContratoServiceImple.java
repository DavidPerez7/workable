package com.workable_sb.workable.service.oferta;

import com.workable_sb.workable.dto.oferta.OfertaTipoContratoCreateDTO;
import com.workable_sb.workable.mapper.oferta.OfertaTipoContratoMapper;
import com.workable_sb.workable.models.OfertaTipoContrato;
import com.workable_sb.workable.repository.OfertaTipoContratoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class OfertaTipoContratoServiceImple implements OfertaTipoContratoService {
    private final OfertaTipoContratoRepository tipoContratoRepository;
    private final OfertaTipoContratoMapper mapper;

    @Override
    public List<OfertaTipoContrato> listarTipoContratos() {
        return tipoContratoRepository.findAll();
    }

    @Override
    public Optional<OfertaTipoContrato> obtenerTipoContrato(Integer id) {
        Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
        return tipoContratoRepository.findById(safeId);
    }

    @Override
    public OfertaTipoContrato crearTipoContrato(OfertaTipoContratoCreateDTO dto) {
        OfertaTipoContrato tipoContrato = mapper.toEntity(dto);
        tipoContrato = Objects.requireNonNull(tipoContrato, "No se pudo mapear el DTO a entidad OfertaTipoContrato");
        return tipoContratoRepository.save(tipoContrato);
    }

    @Override
    public Optional<OfertaTipoContrato> actualizarTipoContrato(Integer id, OfertaTipoContratoCreateDTO dto) {
        Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
        return tipoContratoRepository.findById(safeId).map(tc -> {
            tc.setNombre(dto.getNombre().trim());
            if (dto.getEstado() != null) {
                tc.setEstado(dto.getEstado());
            }
            return tipoContratoRepository.save(tc);
        });
    }

    @Override
    public boolean eliminarTipoContrato(Integer id) {
        Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
        if (!tipoContratoRepository.existsById(safeId)) {
            return false;
        }
        tipoContratoRepository.deleteById(safeId);
        return true;
    }

    @Override
    public Optional<OfertaTipoContrato> actualizarEstado(Integer id, OfertaTipoContrato.EstadoTipoContrato estado) {
        Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
        return tipoContratoRepository.findById(safeId).map(tc -> {
            tc.setEstado(estado);
            return tipoContratoRepository.save(tc);
        });
    }
}
