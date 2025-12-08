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
    public Reclutador crearReclutador(Reclutador reclutador) {
        // Validar que el correo no existe
        if (reclutadorRepo.findByCorreo(reclutador.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // Validar campos obligatorios
        if (reclutador.getNombre() == null || reclutador.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (reclutador.getCorreo() == null || reclutador.getCorreo().isEmpty()) {
            throw new IllegalArgumentException("El correo es obligatorio");
        }

        // Encriptar contraseña
        reclutador.setPassword(passwordEncoder.encode(reclutador.getPassword()));
        reclutador.setRol(Reclutador.Rol.RECLUTADOR);

        return reclutadorRepo.save(reclutador);
    }

    /**
     * Registro público de reclutador (desde formulario de registro)
     * No requiere empresa en el momento de registro
     */
    public Reclutador createPublic(Reclutador request) {
        // Validación de contraseña requerida
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("La contraseña es requerida");
        }
        
        // Validación de correo único
        if (reclutadorRepo.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("Correo already in use");
        }

        // Encriptar contraseña
        request.setPassword(passwordEncoder.encode(request.getPassword()));
        request.setRol(Reclutador.Rol.RECLUTADOR);
        request.setIsActive(true);

        return reclutadorRepo.save(request);
    }

    // ===== READ =====
    public Reclutador obtenerPorId(Long id) {
        return reclutadorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));
    }

    public Reclutador obtenerPorCorreo(String correo) {
        return reclutadorRepo.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));
    }

    public List<Reclutador> obtenerTodos() {
        return reclutadorRepo.findAll();
    }

    // ===== UPDATE (PÚBLICO: el mismo reclutador) =====
    public Reclutador actualizar(Long id, Reclutador request, Long reclutadorIdActual) {
        // Validar que sea el mismo reclutador o admin
        if (!id.equals(reclutadorIdActual)) {
            throw new IllegalStateException("Solo puedes actualizar tu propio perfil");
        }

        Reclutador existingReclutador = obtenerPorId(id);

        // Solo actualizar correo si viene en el request y es diferente
        if (request.getCorreo() != null && !existingReclutador.getCorreo().equals(request.getCorreo())) {
            if (reclutadorRepo.findByCorreo(request.getCorreo()).isPresent()) {
                throw new RuntimeException("Correo already in use");
            }
            existingReclutador.setCorreo(request.getCorreo());
        }

        existingReclutador.setNombre(request.getNombre());
        existingReclutador.setApellido(request.getApellido());
        existingReclutador.setTelefono(request.getTelefono());
        existingReclutador.setUrlFotoPerfil(request.getUrlFotoPerfil());
        existingReclutador.setUrlBanner(request.getUrlBanner());
        existingReclutador.setFechaNacimiento(request.getFechaNacimiento());

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

    // ===== UPDATE (ADMIN: gestión completa) =====
    public Reclutador update(Long id, Reclutador request) {
        Reclutador existingReclutador = obtenerPorId(id);

        // Solo actualizar correo si viene en el request y es diferente
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

    // ===== DELETE =====
    public void eliminarReclutador(Long id, Long reclutadorIdActual) {
        // Validar que sea el mismo reclutador o admin
        if (!id.equals(reclutadorIdActual)) {
            throw new IllegalStateException("Solo puedes eliminar tu propio perfil");
        }

        Reclutador reclutador = obtenerPorId(id);
        reclutador.setIsActive(false); // Soft delete
        reclutadorRepo.save(reclutador);
    }

    // ===== BÚSQUEDA Y FILTRADO =====
    public List<Reclutador> obtenerPorEmpresa(Long empresaId) {
        return reclutadorRepo.findAll().stream()
                .filter(r -> r.getEmpresa() != null && r.getEmpresa().getId().equals(empresaId))
                .toList();
    }

    public List<Reclutador> obtenerActivos() {
        return reclutadorRepo.findAll().stream()
                .filter(r -> r.getIsActive() != null && r.getIsActive())
                .toList();
    }
}
