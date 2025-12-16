package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.PostulacionRepo;
import com.workable_sb.workable.repository.OfertaRepo;

@Service
@Transactional
public class OfertaService {

    @Autowired
    private EmpresaRepository empresaRepo;

    @Autowired
    private MunicipioRepo municipioRepo;

    public Oferta crearOferta(Oferta ofertaRequest) {
        Oferta oferta = new Oferta();
        oferta.setTitulo(ofertaRequest.getTitulo());
        oferta.setDescripcion(ofertaRequest.getDescripcion());
        oferta.setFechaLimite(ofertaRequest.getFechaLimite());
        oferta.setSalario(ofertaRequest.getSalario());
        oferta.setNumeroVacantes(ofertaRequest.getNumeroVacantes());
        if (ofertaRequest.getNivelExperiencia() != null)
            oferta.setNivelExperiencia(ofertaRequest.getNivelExperiencia());
        if (ofertaRequest.getEstado() != null)
            oferta.setEstado(ofertaRequest.getEstado());
        // Requisitos ahora es un String no nulo con max 500 caracteres
        if (ofertaRequest.getRequisitos() == null || ofertaRequest.getRequisitos().trim().isEmpty()) {
            throw new IllegalArgumentException("El campo 'requisitos' es obligatorio y no puede estar vacío");
        }
        String req = ofertaRequest.getRequisitos().trim();
        if (req.length() > 500) {
            throw new IllegalArgumentException("El campo 'requisitos' no puede exceder 500 caracteres");
        }
        oferta.setRequisitos(req);
        if (ofertaRequest.getMunicipio() != null && ofertaRequest.getMunicipio().getId() != null) {
            oferta.setMunicipio(municipioRepo.findById(ofertaRequest.getMunicipio().getId()).orElse(null));
        } else {
            oferta.setMunicipio(ofertaRequest.getMunicipio());
        }
        if (ofertaRequest.getModalidad() != null)
            oferta.setModalidad(ofertaRequest.getModalidad());
        if (ofertaRequest.getTipoContrato() != null)
            oferta.setTipoContrato(ofertaRequest.getTipoContrato());
        if (ofertaRequest.getEmpresa() != null && ofertaRequest.getEmpresa().getId() != null) {
            oferta.setEmpresa(empresaRepo.findById(ofertaRequest.getEmpresa().getId()).orElse(null));
        } else {
            oferta.setEmpresa(ofertaRequest.getEmpresa());
        }
        if (ofertaRequest.getBeneficios() != null && !ofertaRequest.getBeneficios().isEmpty()) {
            oferta.setBeneficios(ofertaRequest.getBeneficios());
        }
        return ofertaRepository.save(oferta);
    }

    @Autowired
    private OfertaRepo ofertaRepository;

    @Autowired
    private PostulacionRepo postulacionRepo;


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
        if (ofertaActualizada.getRequisitos() == null || ofertaActualizada.getRequisitos().trim().isEmpty()) {
            throw new IllegalArgumentException("El campo 'requisitos' es obligatorio y no puede estar vacío");
        }
        String reqUpd = ofertaActualizada.getRequisitos().trim();
        if (reqUpd.length() > 500) {
            throw new IllegalArgumentException("El campo 'requisitos' no puede exceder 500 caracteres");
        }
        existente.setRequisitos(reqUpd);
        existente.setBeneficios(ofertaActualizada.getBeneficios());
        existente.setMunicipio(ofertaActualizada.getMunicipio());
        existente.setEmpresa(ofertaActualizada.getEmpresa());
        // Actualizar campo isActive si viene en la petición
        if (ofertaActualizada.getIsActive() != null) {
            existente.setIsActive(ofertaActualizada.getIsActive());
            // Mantener coherencia con el campo estado (opcional)
            existente.setEstado(ofertaActualizada.getIsActive() ? Oferta.EstadoOferta.ABIERTA : Oferta.EstadoOferta.CERRADA);
        }
        // habilidadesRequeridas eliminado
        return ofertaRepository.save(existente);
    }

    // DELETE
    public void eliminarOferta(Long id) {
        Oferta existente = obtenerPorId(id);
        // eliminar postulaciones asociadas primero para evitar violaciones de FK
        try {
            var postulaciones = postulacionRepo.findByOfertaId(id);
            if (postulaciones != null && !postulaciones.isEmpty()) {
                postulacionRepo.deleteAll(postulaciones);
            }
        } catch (Exception e) {
            // registrar y re-lanzar como RuntimeException para que el controlador devuelva 500 y el front muestre el error
            throw new RuntimeException("No se pudieron eliminar las postulaciones asociadas: " + e.getMessage(), e);
        }
        ofertaRepository.delete(existente);
    }
}

