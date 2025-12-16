package com.workable_sb.workable.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.exception.ResourceNotFoundException;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Reclutador;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.PostulacionRepo;
import com.workable_sb.workable.repository.ReclutadorRepo;

@Service
@Transactional
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private ReclutadorRepo usuarioRepository;

    @Autowired
    private MunicipioRepo municipioRepo;

    @Autowired
    private PostulacionRepo postulacionRepo;

    // ===== READ =====
    public Optional<Empresa> getById(Long id) {
        return empresaRepository.findById(id);
    }

    public Optional<Empresa> getByNit(String nit) {
        return empresaRepository.findByNit(nit);
    }

    public List<Empresa> getAll() {
        return empresaRepository.findAll();
    }

    public List<Empresa> getByIsActive(Boolean isActive) {
        return empresaRepository.findByIsActive(isActive);
    }

    // READ (para reclutadores de la empresa)
    public List<Reclutador> getReclutadores(Long empresaId) {
        Empresa empresa = empresaRepository.findById(empresaId).orElseThrow(() -> new RuntimeException("Empresa not found"));
        return empresa.getReclutadores();
    }

    // ===== CREATE =====
    public Empresa create(Empresa request) {
        if (empresaRepository.existsByNit(request.getNit())) {
            throw new IllegalArgumentException("El NIT ya está en uso");
        }

        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                .orElseThrow(() -> new RuntimeException("Municipio not found"));
            request.setMunicipio(municipio);
        }

        return empresaRepository.save(request);
    }

    // ===== UPDATE =====
    public Empresa update(Long id, Empresa request) {
        Empresa existingEmpresa = empresaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Empresa not found"));

        existingEmpresa.setNombre(request.getNombre());
        existingEmpresa.setDescripcion(request.getDescripcion());
        existingEmpresa.setNumeroTrabajadores(request.getNumeroTrabajadores());
        existingEmpresa.setPuntuacion(request.getPuntuacion());
        existingEmpresa.setEmailContacto(request.getEmailContacto());
        existingEmpresa.setTelefonoContacto(request.getTelefonoContacto());
        existingEmpresa.setWebsite(request.getWebsite());
        existingEmpresa.setLogoUrl(request.getLogoUrl());
        existingEmpresa.setRedesSociales(request.getRedesSociales());
        existingEmpresa.setDirecciones(request.getDirecciones());
        existingEmpresa.setRazonSocial(request.getRazonSocial());
        existingEmpresa.setIsActive(request.getIsActive());
        existingEmpresa.setCategories(request.getCategories());

        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                .orElseThrow(() -> new RuntimeException("Municipio not found"));
            existingEmpresa.setMunicipio(municipio);
        }

        return empresaRepository.save(existingEmpresa);
    }

    // ===== DELETE =====
    public void delete(Long id) {
        Empresa existingEmpresa = empresaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Empresa not found"));

        // Remove postulaciones that belong to offers of this company to avoid FK constraint
        for (Oferta oferta : existingEmpresa.getOfertas()) {
            postulacionRepo.deleteAll(postulacionRepo.findByOfertaId(oferta.getId()));
        }

        empresaRepository.delete(existingEmpresa);
    }
}
