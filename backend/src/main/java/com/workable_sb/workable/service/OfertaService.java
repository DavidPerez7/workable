
package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.repository.OfertaRepo;

@Service
@Transactional
public class OfertaService {

    @Autowired
    private OfertaRepo ofertaRepository;

    // CREATE
    public Oferta crearOferta(Oferta oferta) {
        return ofertaRepository.save(oferta);
    }

    // GET ALL
    public List<Oferta> listarTodas() {
        return ofertaRepository.findAll();
    }

    // GET BY ID
    public Oferta obtenerPorId(Long id) {
        return ofertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada con id: " + id));
    }

    // UPDATE
    public Oferta actualizarOferta(Long id, Oferta ofertaActualizada) {
        Oferta existente = obtenerPorId(id);
        existente.setTitulo(ofertaActualizada.getTitulo());
        existente.setDescripcion(ofertaActualizada.getDescripcion());
        existente.setFechaLimite(ofertaActualizada.getFechaLimite());
        existente.setSalario(ofertaActualizada.getSalario());
        existente.setNumeroVacantes(ofertaActualizada.getNumeroVacantes());
        existente.setNivelExperiencia(ofertaActualizada.getNivelExperiencia());
        existente.setModalidad(ofertaActualizada.getModalidad());
        existente.setTipoContrato(ofertaActualizada.getTipoContrato());
        existente.setRequisitos(ofertaActualizada.getRequisitos());
        existente.setBeneficios(ofertaActualizada.getBeneficios());
        existente.setMunicipio(ofertaActualizada.getMunicipio());
        existente.setEmpresa(ofertaActualizada.getEmpresa());
        // habilidadesRequeridas eliminado
        return ofertaRepository.save(existente);
    }

    // DELETE
    public void eliminarOferta(Long id) {
        Oferta existente = obtenerPorId(id);
        ofertaRepository.delete(existente);
    }
}

