package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.MunicipioRepo;
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

    // CREATE
    public Oferta create(Oferta request) {
        if (request.getEmpresa() == null || request.getEmpresa().getId() == null) {
            throw new RuntimeException("Empresa es obligatoria");
        }

        Empresa empresa = empresaRepo.findById(request.getEmpresa().getId())
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
        request.setEmpresa(empresa);

        if (request.getMunicipio() != null && request.getMunicipio().getId() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
            request.setMunicipio(municipio);
        }

        return ofertaRepository.save(request);
    }

    // READ
    public List<Oferta> getAll() {
        return ofertaRepository.findAll();
    }

    public Oferta getById(Long id) {
        return ofertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
    }

    public List<Oferta> getByNombre(String nombre) {
        return ofertaRepository.findByTituloContainingIgnoreCase(nombre);
    }

    public List<Oferta> getByNivelExperiencia(String nivelExperiencia) {
        return ofertaRepository.findByNivelExperiencia(nivelExperiencia);
    }

    public List<Oferta> getByModalidad(String modalidad) {
        return ofertaRepository.findByModalidad(Oferta.Modalidad.valueOf(modalidad.toUpperCase()));
    }

    public List<Oferta> getByEmpresa(Long empresaId) {
        return ofertaRepository.findByEmpresaId(empresaId);
    }

    public List<Oferta> getByUbicacion(Long municipioId) {
        municipioRepo.findById(municipioId)
                .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
        return ofertaRepository.findByMunicipioId(municipioId);
    }

    // UPDATE
    public Oferta update(Long id, Oferta request) {
        Oferta existing = getById(id);

        if (request.getTitulo() != null) existing.setTitulo(request.getTitulo());
        if (request.getDescripcion() != null) existing.setDescripcion(request.getDescripcion());
        if (request.getFechaLimite() != null) existing.setFechaLimite(request.getFechaLimite());
        if (request.getSalario() != null) existing.setSalario(request.getSalario());
        if (request.getNumeroVacantes() != null) existing.setNumeroVacantes(request.getNumeroVacantes());
        if (request.getNivelExperiencia() != null) existing.setNivelExperiencia(request.getNivelExperiencia());
        if (request.getModalidad() != null) existing.setModalidad(request.getModalidad());
        if (request.getTipoContrato() != null) existing.setTipoContrato(request.getTipoContrato());
        if (request.getRequisitos() != null) existing.setRequisitos(request.getRequisitos());

        if (request.getMunicipio() != null && request.getMunicipio().getId() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
            existing.setMunicipio(municipio);
        }

        if (request.getEmpresa() != null && request.getEmpresa().getId() != null) {
            Empresa empresa = empresaRepo.findById(request.getEmpresa().getId())
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
            existing.setEmpresa(empresa);
        }

        return ofertaRepository.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        ofertaRepository.deleteById(id);
    }
}

