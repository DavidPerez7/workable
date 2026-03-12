package com.workable_sb.workable.service;

import java.util.List;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.workable_sb.workable.models.Administrador;
import com.workable_sb.workable.repository.AdministradorRepo;

@Service
@Transactional
public class AdministradorService {

    @Autowired
    private AdministradorRepo administradorRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // CREATE
    public Administrador create(Administrador request) {
        if (administradorRepo.findByCorreo(request.getCorreo()).isPresent()) {
            throw new IllegalArgumentException("Correo ya en uso");
        }

        request.setPassword(passwordEncoder.encode(request.getPassword()));
        return administradorRepo.save(request);
    }


    // READ
    public List<Administrador> getAll() {
        return administradorRepo.findAll();
    }

    public Administrador getById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        return administradorRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Administrador no encontrado"));
    }

    public Administrador getByCorreo(String correo) {
        return administradorRepo.findByCorreo(correo).orElseThrow(() -> new IllegalArgumentException("Administrador no encontrado"));
    }


    // UPDATE
    public Administrador update(Long id, Administrador request) {
        Administrador existing = getById(id);

        if (!Objects.equals(existing.getCorreo(), request.getCorreo())) {
            if (administradorRepo.findByCorreo(request.getCorreo()).isPresent()) {
                throw new IllegalArgumentException("Correo ya en uso");
            }
            existing.setCorreo(request.getCorreo());
        }

        if (request.getNombre() != null) existing.setNombre(request.getNombre());
        if (request.getApellido() != null) existing.setApellido(request.getApellido());
        if (request.getIsActive() != null) existing.setIsActive(request.getIsActive());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return administradorRepo.save(existing);
    }


    // DELETE
    public void delete(Long id) {
        if (id == null) return;
        Administrador existing = getById(id);
        if (existing != null) {
            administradorRepo.delete(existing);
        }
    }
}
