package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Administrador;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.repository.AdministradorRepo;
import com.workable_sb.workable.repository.MunicipioRepo;

@Service
@Transactional
public class AdministradorService {

    @Autowired
    private AdministradorRepo administradorRepo;

    @Autowired
    private MunicipioRepo municipioRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ===== CREATE =====
    public Administrador create(Administrador request) {
        if (administradorRepo.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("Correo already in use");
        }

        if (request.getNombre() == null || request.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (request.getCorreo() == null || request.getCorreo().isEmpty()) {
            throw new IllegalArgumentException("El correo es obligatorio");
        }

        request.setPassword(passwordEncoder.encode(request.getPassword()));
        request.setRol(Administrador.Rol.ADMIN);

        return administradorRepo.save(request);
    }

    // ===== READ =====
    public List<Administrador> getAll() {
        return administradorRepo.findAll();
    }

    public Administrador getById(Long id) {
        return administradorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
    }

    public Administrador getByCorreo(String correo) {
        return administradorRepo.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
    }

    // ===== UPDATE =====
    public Administrador update(Long id, Administrador request) {
        Administrador existing = getById(id);

        if (request.getCorreo() != null && !existing.getCorreo().equals(request.getCorreo())) {
            if (administradorRepo.findByCorreo(request.getCorreo()).isPresent()) {
                throw new RuntimeException("Correo already in use");
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

        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio not found"));
            existing.setMunicipio(municipio);
        }

        return administradorRepo.save(existing);
    }

    // ===== DELETE =====
    public void delete(Long id) {
        Administrador administrador = getById(id);
        administradorRepo.delete(administrador);
    }
}
