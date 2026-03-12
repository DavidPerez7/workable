package com.workable_sb.workable.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.MunicipioRepo;

@Service
@Transactional
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private MunicipioRepo municipioRepo;

    // CREATE
    public Empresa create(Empresa request) {
        if (empresaRepository.existsByNit(request.getNit())) {
            throw new RuntimeException("NIT ya está en uso");
        }

        if (request.getMunicipio() != null) {
            Long municipioId = request.getMunicipio().getId();
            if (municipioId != null) {
                Municipio municipio = municipioRepo.findById(municipioId)
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
                request.setMunicipio(municipio);
            }
        }

        return empresaRepository.save(request);
    }

    // READ
    public List<Empresa> getAll() {
        return empresaRepository.findAll();
    }

    public Empresa getById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        return empresaRepository.findById(id).orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
    }

    public Empresa getByNit(String nit) {
        return empresaRepository.findByNit(nit).orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
    }

    public List<Empresa> getByIsActive(Boolean isActive) {
        return empresaRepository.findByIsActive(isActive);
    }

    // UPDATE
    public Empresa update(Long id, Empresa request) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        Empresa existing = empresaRepository.findById(id).orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        if (request.getNombre() != null) existing.setNombre(request.getNombre());
        if (request.getDescripcion() != null) existing.setDescripcion(request.getDescripcion());
        if (request.getNumeroTrabajadores() != null) existing.setNumeroTrabajadores(request.getNumeroTrabajadores());
        if (request.getIsActive() != null) existing.setIsActive(request.getIsActive());
        if (request.getCategories() != null) existing.setCategories(request.getCategories());

        if (request.getMunicipio() != null) {
            Long municipioId = request.getMunicipio().getId();
            if (municipioId != null) {
                Municipio municipio = municipioRepo.findById(municipioId)
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
                existing.setMunicipio(municipio);
            }
        }

        if (existing == null) {
            throw new RuntimeException("Empresa no encontrada");
        }

        return empresaRepository.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        if (id == null) return;
        Empresa existing = getById(id); // valida que exista
        if (existing != null) {
            empresaRepository.delete(existing);
        }
    }
}
