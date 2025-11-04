package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.TipoContratoCreateDTO;
import com.workable_sb.workable.models.TipoContrato;
import com.workable_sb.workable.repository.TipoContratoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TipoContratoService {
    @Autowired
    private TipoContratoRepository tipoContratoRepository;

    public List<TipoContrato> listarTipoContratos() {
        return tipoContratoRepository.findAll();
    }

    public Optional<TipoContrato> obtenerTipoContrato(Integer id) {
        return tipoContratoRepository.findById(id);
    }

    public TipoContrato crearTipoContrato(TipoContratoCreateDTO dto) {
        TipoContrato tipoContrato = TipoContratoMapper.toEntity(dto);
        return tipoContratoRepository.save(tipoContrato);
    }

    public Optional<TipoContrato> actualizarTipoContrato(Integer id, TipoContratoCreateDTO dto) {
        return tipoContratoRepository.findById(id).map(tc -> {
            tc.setNombre(dto.getNombre().trim());
            if (dto.getEstado() != null) {
                tc.setEstado(dto.getEstado());
            }
            return tipoContratoRepository.save(tc);
        });
    }

    public boolean eliminarTipoContrato(Integer id) {
        if (!tipoContratoRepository.existsById(id)) {
            return false;
        }
        tipoContratoRepository.deleteById(id);
        return true;
    }

    public Optional<TipoContrato> actualizarEstado(Integer id, TipoContrato.EstadoTipoContrato estado) {
        return tipoContratoRepository.findById(id).map(tc -> {
            tc.setEstado(estado);
            return tipoContratoRepository.save(tc);
        });
    }
}
