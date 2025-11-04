package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.ModalidadCreateDTO;
import com.workable_sb.workable.models.Modalidad;
import com.workable_sb.workable.repository.ModalidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ModalidadService {
    @Autowired
    private ModalidadRepository modalidadRepository;

    public List<Modalidad> listarModalidades() {
        return modalidadRepository.findAll();
    }

    public Optional<Modalidad> obtenerModalidad(Integer id) {
        return modalidadRepository.findById(id);
    }

    public Modalidad crearModalidad(ModalidadCreateDTO dto) {
        Modalidad modalidad = ModalidadMapper.toEntity(dto);
        return modalidadRepository.save(modalidad);
    }

    public Optional<Modalidad> actualizarModalidad(Integer id, ModalidadCreateDTO dto) {
        return modalidadRepository.findById(id).map(m -> {
            m.setNombre(dto.getNombre().trim());
            if (dto.getEstado() != null) {
                m.setEstado(dto.getEstado());
            }
            return modalidadRepository.save(m);
        });
    }

    public boolean eliminarModalidad(Integer id) {
        if (!modalidadRepository.existsById(id)) {
            return false;
        }
        modalidadRepository.deleteById(id);
        return true;
    }

    public Optional<Modalidad> actualizarEstado(Integer id, Modalidad.EstadoModalidad estado) {
        return modalidadRepository.findById(id).map(m -> {
            m.setEstado(estado);
            return modalidadRepository.save(m);
        });
    }
}
