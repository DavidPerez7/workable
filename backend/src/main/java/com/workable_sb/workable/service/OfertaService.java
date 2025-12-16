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
    private OfertaRepo ofertaRepository;

    @Autowired
    private EmpresaRepository empresaRepo;

    @Autowired
    private MunicipioRepo municipioRepo;

    @Autowired
    private PostulacionRepo postulacionRepo;

    // ===== CREATE =====
    public Oferta create(Oferta ofertaRequest) {
        if (ofertaRequest.getRequisitos() == null || ofertaRequest.getRequisitos().trim().isEmpty()) {
            throw new IllegalArgumentException("El campo 'requisitos' es obligatorio y no puede estar vacío");
        }
        String req = ofertaRequest.getRequisitos().trim();
        if (req.length() > 500) {
            throw new IllegalArgumentException("El campo 'requisitos' no puede exceder 500 caracteres");
        }

        Oferta oferta = new Oferta();
        oferta.setTitulo(ofertaRequest.getTitulo());
        oferta.setDescripcion(ofertaRequest.getDescripcion());
        oferta.setFechaLimite(ofertaRequest.getFechaLimite());
        oferta.setSalario(ofertaRequest.getSalario());
        oferta.setNumeroVacantes(ofertaRequest.getNumeroVacantes());
        oferta.setNivelExperiencia(ofertaRequest.getNivelExperiencia());
        oferta.setRequisitos(req);
        oferta.setModalidad(ofertaRequest.getModalidad());
        oferta.setTipoContrato(ofertaRequest.getTipoContrato());
        oferta.setEstado(ofertaRequest.getEstado() != null ? ofertaRequest.getEstado() : Oferta.EstadoOferta.ABIERTA);
        
        if (ofertaRequest.getMunicipio() != null && ofertaRequest.getMunicipio().getId() != null) {
            oferta.setMunicipio(municipioRepo.findById(ofertaRequest.getMunicipio().getId())
                .orElseThrow(() -> new RuntimeException("Municipio not found")));
        }
        
        if (ofertaRequest.getEmpresa() != null && ofertaRequest.getEmpresa().getId() != null) {
            oferta.setEmpresa(empresaRepo.findById(ofertaRequest.getEmpresa().getId())
                .orElseThrow(() -> new RuntimeException("Empresa not found")));
        }
        
        if (ofertaRequest.getBeneficios() != null && !ofertaRequest.getBeneficios().isEmpty()) {
            oferta.setBeneficios(ofertaRequest.getBeneficios());
        }
        
        return ofertaRepository.save(oferta);
    }

    // ===== READ =====
    public List<Oferta> getAll() {
        return ofertaRepository.findAll();
    }

    public Oferta getById(Long id) {
        return ofertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada con id: " + id));
    }

    // ===== UPDATE =====
    public Oferta update(Long id, Oferta ofertaActualizada) {
        Oferta existing = getById(id);
        
        if (ofertaActualizada.getRequisitos() == null || ofertaActualizada.getRequisitos().trim().isEmpty()) {
            throw new IllegalArgumentException("El campo 'requisitos' es obligatorio y no puede estar vacío");
        }
        String reqUpd = ofertaActualizada.getRequisitos().trim();
        if (reqUpd.length() > 500) {
            throw new IllegalArgumentException("El campo 'requisitos' no puede exceder 500 caracteres");
        }

        existing.setTitulo(ofertaActualizada.getTitulo());
        existing.setDescripcion(ofertaActualizada.getDescripcion());
        existing.setFechaLimite(ofertaActualizada.getFechaLimite());
        existing.setSalario(ofertaActualizada.getSalario());
        existing.setNumeroVacantes(ofertaActualizada.getNumeroVacantes());
        existing.setNivelExperiencia(ofertaActualizada.getNivelExperiencia());
        existing.setModalidad(ofertaActualizada.getModalidad());
        existing.setTipoContrato(ofertaActualizada.getTipoContrato());
        existing.setRequisitos(reqUpd);
        existing.setBeneficios(ofertaActualizada.getBeneficios());
        
        if (ofertaActualizada.getMunicipio() != null) {
            existing.setMunicipio(ofertaActualizada.getMunicipio());
        }
        if (ofertaActualizada.getEmpresa() != null) {
            existing.setEmpresa(ofertaActualizada.getEmpresa());
        }
        if (ofertaActualizada.getIsActive() != null) {
            existing.setIsActive(ofertaActualizada.getIsActive());
            existing.setEstado(ofertaActualizada.getIsActive() ? Oferta.EstadoOferta.ABIERTA : Oferta.EstadoOferta.CERRADA);
        }
        
        return ofertaRepository.save(existing);
    }

    // ===== DELETE =====
    public void delete(Long id) {
        Oferta existing = getById(id);
        try {
            var postulaciones = postulacionRepo.findByOfertaId(id);
            if (postulaciones != null && !postulaciones.isEmpty()) {
                postulacionRepo.deleteAll(postulaciones);
            }
        } catch (Exception e) {
            throw new RuntimeException("No se pudieron eliminar las postulaciones asociadas: " + e.getMessage(), e);
        }
        ofertaRepository.delete(existing);
    }
}

