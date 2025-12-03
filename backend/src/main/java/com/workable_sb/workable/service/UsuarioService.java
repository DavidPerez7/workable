package com.workable_sb.workable.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

@Service
@Transactional
public class UsuarioService {
    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private MunicipioRepo municipioRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ===== READ =====
    public Optional<Usuario> getById(Long id) {
        return usuarioRepo.findById(id);
    }

    public Optional<Usuario> getByCorreo(String correo) {
        return usuarioRepo.findByCorreo(correo);
    }

    public Optional<Usuario> getByNombre(String nombre) {
        return usuarioRepo.findByNombre(nombre);
    }

    public List<Usuario> getByRol(Usuario.Rol rol) {
        return usuarioRepo.findByRol(rol);
    }

    public List<Usuario> getByIsActive(Boolean isActive) {
        return usuarioRepo.findByIsActive(isActive);
    }

    public List<Usuario> getByMunicipio(Long municipioId) {
        return usuarioRepo.findByMunicipioId(municipioId);
    }

    // ===== CREATE =====
    public Usuario createPublic(Usuario request) {
        
        if (usuarioRepo.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("Correo already in use");
        }

        // Validación: No permitir ADMIN en registro público
        if (request.getRol() == Usuario.Rol.ADMIN) {
            throw new RuntimeException("Cannot register user with ADMIN role");
        }

        Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                .orElseThrow(() -> new RuntimeException("Municipio not found"));
        request.setMunicipio(municipio);

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        request.setPassword(hashedPassword);

        return usuarioRepo.save(request);
    }

    public Usuario create(Usuario request) {
        
        if (usuarioRepo.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("Correo already in use");
        }

        Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                .orElseThrow(() -> new RuntimeException("Municipio not found"));
        request.setMunicipio(municipio);

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        request.setPassword(hashedPassword);

        return usuarioRepo.save(request);
    }

    // ===== UPDATE =====
    public Usuario update(Long id, Usuario request, Long usuarioActualId) {

        Usuario existingUsuario = usuarioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar permisos: solo el mismo usuario o ADMIN pueden actualizar
        if (!puedeModificarUsuario(existingUsuario, usuarioActualId)) {
            throw new IllegalStateException("Solo el dueño o un ADMIN pueden actualizar este usuario");
        }

        // Validar correo único (solo si cambió)
        if (!existingUsuario.getCorreo().equals(request.getCorreo())) {
            if (usuarioRepo.findByCorreo(request.getCorreo()).isPresent()) {
                throw new RuntimeException("Correo already in use");
            }
            existingUsuario.setCorreo(request.getCorreo());
        }

        existingUsuario.setNombre(request.getNombre());
        existingUsuario.setApellido(request.getApellido());
        existingUsuario.setTelefono(request.getTelefono());
        existingUsuario.setUrlFotoPerfil(request.getUrlFotoPerfil());
        existingUsuario.setFechaNacimiento(request.getFechaNacimiento());

        // Solo ADMIN puede cambiar isActive y rol
        Usuario usuarioActual = usuarioRepo.findById(usuarioActualId)
                .orElseThrow(() -> new RuntimeException("Usuario actual no encontrado"));
        if (usuarioActual.getRol() == Usuario.Rol.ADMIN) {
            existingUsuario.setIsActive(request.getIsActive());
            existingUsuario.setRol(request.getRol());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(request.getPassword());
            existingUsuario.setPassword(hashedPassword);
        }

        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio not found"));
            existingUsuario.setMunicipio(municipio);
        }

        return usuarioRepo.save(existingUsuario);
    }

    // ===== DELETE =====
    public void delete(Long id, Long usuarioActualId) {

        Usuario existingUsuario = usuarioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar permisos: solo el mismo usuario o ADMIN pueden eliminar
        if (!puedeModificarUsuario(existingUsuario, usuarioActualId)) {
            throw new IllegalStateException("Solo el dueño o un ADMIN pueden eliminar este usuario");
        }

        existingUsuario.setIsActive(false);
        usuarioRepo.save(existingUsuario);
    }

    public void deleteFisico(Long id) {

        if (!usuarioRepo.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }

        usuarioRepo.deleteById(id);
    }

    private boolean puedeModificarUsuario(Usuario usuario, Long usuarioActualId) {
        Usuario usuarioActual = usuarioRepo.findById(usuarioActualId)
                .orElseThrow(() -> new RuntimeException("Usuario actual no encontrado"));
        
        // Es ADMIN o es el mismo usuario
        return usuarioActual.getRol() == Usuario.Rol.ADMIN || usuario.getId().equals(usuarioActualId);
    }
}
