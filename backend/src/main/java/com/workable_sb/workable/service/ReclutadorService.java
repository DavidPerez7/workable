package com.workable_sb.workable.service;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Reclutador;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.repository.ReclutadorRepo;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.EmpresaRepository;

@Service
@Transactional
public class ReclutadorService {

    @Autowired
    private ReclutadorRepo reclutadorRepo;

    @Autowired
    private MunicipioRepo municipioRepo;

    @Autowired
    private EmpresaRepository empresaRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // CREATE
    public Reclutador create(Reclutador request) {
        if (reclutadorRepo.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("Correo ya está en uso");
        }

        request.setPassword(passwordEncoder.encode(request.getPassword()));

        return reclutadorRepo.save(request);
    }

    // READ
    public List<Reclutador> getAll() {
        return reclutadorRepo.findAll();
    }

    public Reclutador getById(Long id) {
        return reclutadorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));
    }

    public Reclutador getByCorreo(String correo) {
        return reclutadorRepo.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));
    }

    public List<Reclutador> getByEmpresaId(Long empresaId) {
        return reclutadorRepo.findAll().stream()
                .filter(r -> r.getEmpresa() != null && r.getEmpresa().getId().equals(empresaId))
                .toList();
    }

    // UPDATE
    public Reclutador update(Long id, Reclutador request) {
        Reclutador existing = getById(id);

        if (!Objects.equals(existing.getCorreo(), request.getCorreo())) {
            if (reclutadorRepo.findByCorreo(request.getCorreo()).isPresent()) {
                throw new RuntimeException("Correo ya está en uso");
            }
            existing.setCorreo(request.getCorreo());
        }

        if (request.getNombre() != null) existing.setNombre(request.getNombre());
        if (request.getApellido() != null) existing.setApellido(request.getApellido());
        if (request.getTelefono() != null) existing.setTelefono(request.getTelefono());
        if (request.getFechaNacimiento() != null) existing.setFechaNacimiento(request.getFechaNacimiento());
        if (request.getIsActive() != null) existing.setIsActive(request.getIsActive());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(request.getPassword()));
        }

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

        return reclutadorRepo.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        reclutadorRepo.deleteById(id);
    }
}
