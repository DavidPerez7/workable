package com.workable_sb.workable.service;

import java.time.LocalDateTime;
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
    public Administrador crearAdministrador(Administrador administrador) {
        // Validar que el correo no existe
        if (administradorRepo.findByCorreo(administrador.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // Validar campos obligatorios
        if (administrador.getNombre() == null || administrador.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (administrador.getCorreo() == null || administrador.getCorreo().isEmpty()) {
            throw new IllegalArgumentException("El correo es obligatorio");
        }

        // Encriptar contraseña
        administrador.setPassword(passwordEncoder.encode(administrador.getPassword()));
        administrador.setRol(Administrador.Rol.ADMIN);

        return administradorRepo.save(administrador);
    }

    // ===== READ =====
    public Administrador obtenerPorId(Long id) {
        return administradorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
    }

    public Administrador obtenerPorCorreo(String correo) {
        return administradorRepo.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
    }

    public List<Administrador> obtenerTodos() {
        return administradorRepo.findAll();
    }

    // ===== UPDATE =====
    public Administrador actualizar(Long id, Administrador request) {
        Administrador existingAdministrador = obtenerPorId(id);

        // Solo actualizar correo si viene en el request y es diferente
        if (request.getCorreo() != null && !existingAdministrador.getCorreo().equals(request.getCorreo())) {
            if (administradorRepo.findByCorreo(request.getCorreo()).isPresent()) {
                throw new RuntimeException("Correo already in use");
            }
            existingAdministrador.setCorreo(request.getCorreo());
        }

        if (request.getNombre() != null) existingAdministrador.setNombre(request.getNombre());
        if (request.getApellido() != null) existingAdministrador.setApellido(request.getApellido());
        if (request.getTelefono() != null) existingAdministrador.setTelefono(request.getTelefono());
        if (request.getFechaNacimiento() != null) existingAdministrador.setFechaNacimiento(request.getFechaNacimiento());
        if (request.getIsActive() != null) existingAdministrador.setIsActive(request.getIsActive());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existingAdministrador.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio not found"));
            existingAdministrador.setMunicipio(municipio);
        }

        return administradorRepo.save(existingAdministrador);
    }

    // ===== DELETE =====
    public void eliminarAdministrador(Long id) {
        Administrador administrador = obtenerPorId(id);
        administrador.setIsActive(false); // Soft delete
        administradorRepo.save(administrador);
    }

    // ===== BÚSQUEDA Y FILTRADO =====
    public List<Administrador> obtenerActivos() {
        return administradorRepo.findAll().stream()
                .filter(a -> a.getIsActive() != null && a.getIsActive())
                .toList();
    }

    // ===== ACTUALIZAR ÚLTIMO ACCESO =====
    public void actualizarUltimoAcceso(Long id) {
        Administrador administrador = obtenerPorId(id);
        administrador.setUltimoAcceso(LocalDateTime.now());
        administradorRepo.save(administrador);
    }
}
