package com.workable_sb.workable.service;

import java.util.List;

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

    // ===== CREATE =====
    public Reclutador create(Reclutador request) {
        // Validar que el correo no existe
        if (reclutadorRepo.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("Correo already in use");
        }

        // Validar campos obligatorios
        if (request.getNombre() == null || request.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (request.getCorreo() == null || request.getCorreo().isEmpty()) {
            throw new IllegalArgumentException("El correo es obligatorio");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es requerida");
        }

        // Encriptar contraseña
        request.setPassword(passwordEncoder.encode(request.getPassword()));
        request.setRol(Reclutador.Rol.RECLUTADOR);
        request.setIsActive(true);

        return reclutadorRepo.save(request);
    }

    // ===== READ =====
    public Reclutador getById(Long id) {
        return reclutadorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));
    }

    public Reclutador getByCorreo(String correo) {
        return reclutadorRepo.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));
    }

    public List<Reclutador> getAll() {
        return reclutadorRepo.findAll();
    }

    public List<Reclutador> getByEmpresaId(Long empresaId) {
        return reclutadorRepo.findAll().stream()
                .filter(r -> r.getEmpresa() != null && r.getEmpresa().getId().equals(empresaId))
                .toList();
    }

    // ===== UPDATE =====
    public Reclutador update(Long id, Reclutador request) {
        Reclutador existingReclutador = getById(id);

        // Validar correo único si cambió
        if (request.getCorreo() != null && !existingReclutador.getCorreo().equals(request.getCorreo())) {
            if (reclutadorRepo.findByCorreo(request.getCorreo()).isPresent()) {
                throw new RuntimeException("Correo already in use");
            }
            existingReclutador.setCorreo(request.getCorreo());
        }

        if (request.getNombre() != null) existingReclutador.setNombre(request.getNombre());
        if (request.getApellido() != null) existingReclutador.setApellido(request.getApellido());
        if (request.getTelefono() != null) existingReclutador.setTelefono(request.getTelefono());
        if (request.getUrlFotoPerfil() != null) existingReclutador.setUrlFotoPerfil(request.getUrlFotoPerfil());
        if (request.getUrlBanner() != null) existingReclutador.setUrlBanner(request.getUrlBanner());
        if (request.getFechaNacimiento() != null) existingReclutador.setFechaNacimiento(request.getFechaNacimiento());
        if (request.getIsActive() != null) existingReclutador.setIsActive(request.getIsActive());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existingReclutador.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio not found"));
            existingReclutador.setMunicipio(municipio);
        }

        if (request.getEmpresa() != null) {
            Empresa empresa = empresaRepo.findById(request.getEmpresa().getId())
                    .orElseThrow(() -> new RuntimeException("Empresa not found"));
            existingReclutador.setEmpresa(empresa);
        }

        return reclutadorRepo.save(existingReclutador);
    }

    // Asignar empresa al reclutador logueado
    public Reclutador asignarEmpresa(Long reclutadorId, Long empresaId) {
        Reclutador reclutador = getById(reclutadorId);
        Empresa empresa = empresaRepo.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
        reclutador.setEmpresa(empresa);
        return reclutadorRepo.save(reclutador);
    }

    // ===== DELETE =====
    public void delete(Long id) {
        Reclutador reclutador = getById(id);
        reclutador.setIsActive(false);
        reclutadorRepo.save(reclutador);
    }
}
