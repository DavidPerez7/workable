package com.workable_sb.workable.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private PasswordEncoder passwordEncoder;

    // - READ
    public List<Usuario> getAll() {
        return usuarioRepo.findAll();
    }

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


    // - CREATE
    public Usuario createPublic(Usuario request) {
        // Validación de contraseña requerida
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("La contraseña es requerida");
        }
        
        // Solo validación de correo único y municipio existente
        if (usuarioRepo.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("Correo already in use");
        }
        if (request.getRol() == Usuario.Rol.ADMIN) {
            throw new IllegalStateException("No se permite crear usuarios ADMIN desde el registro público");
        }

        // Municipio es opcional, solo validar si se proporciona
        if (request.getMunicipio() != null && request.getMunicipio().getId() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId()).orElseThrow(() -> new RuntimeException("Municipio not found"));
            request.setMunicipio(municipio);
        } else {
            request.setMunicipio(null);
        }

        request.setPassword(passwordEncoder.encode(request.getPassword()));
        return usuarioRepo.save(request);
    }

    public Usuario create(Usuario request) {
        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId()).orElseThrow(() -> new RuntimeException("Municipio not found"));
            request.setMunicipio(municipio);
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            request.setPassword(passwordEncoder.encode("123456"));
        } else {
            request.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return usuarioRepo.save(request);
    }



    // - UPDATE (PUBLICO: solo aspirantes/reclutadores, no puede modificar ADMIN)
    public Usuario updatePublic(Long id, Usuario request, Long usuarioActualId) {
        Usuario existingUsuario = usuarioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Solo el propio usuario puede actualizar
        if (!existingUsuario.getId().equals(usuarioActualId)) {
            throw new IllegalStateException("Solo puedes actualizar tu propio usuario");
        }
        // No se puede modificar un usuario ADMIN
        if (existingUsuario.getRol() == Usuario.Rol.ADMIN) {
            throw new IllegalStateException("No puedes modificar un usuario ADMIN");
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
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existingUsuario.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio not found"));
            existingUsuario.setMunicipio(municipio);
        }
        return usuarioRepo.save(existingUsuario);
    }

    // - UPDATE (ADMIN: gestión completa)
    public Usuario update(Long id, Usuario request) {
        Usuario existingUsuario = usuarioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Solo actualizar correo si viene en el request y es diferente
        if (request.getCorreo() != null && !existingUsuario.getCorreo().equals(request.getCorreo())) {
            if (usuarioRepo.findByCorreo(request.getCorreo()).isPresent()) {
                throw new RuntimeException("Correo already in use");
            }
            existingUsuario.setCorreo(request.getCorreo());
        }
        
        if (request.getNombre() != null) existingUsuario.setNombre(request.getNombre());
        if (request.getApellido() != null) existingUsuario.setApellido(request.getApellido());
        if (request.getTelefono() != null) existingUsuario.setTelefono(request.getTelefono());
        if (request.getUrlFotoPerfil() != null) existingUsuario.setUrlFotoPerfil(request.getUrlFotoPerfil());
        if (request.getFechaNacimiento() != null) existingUsuario.setFechaNacimiento(request.getFechaNacimiento());
        if (request.getIsActive() != null) existingUsuario.setIsActive(request.getIsActive());
        if (request.getRol() != null) existingUsuario.setRol(request.getRol());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existingUsuario.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio not found"));
            existingUsuario.setMunicipio(municipio);
        }
        return usuarioRepo.save(existingUsuario);
    }

    // - DELETE (PUBLICO: solo aspirantes/reclutadores, no puede eliminar ADMIN)
    public void deletePublic(Long id, Long usuarioActualId) {
        Usuario existingUsuario = usuarioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        // Solo el propio usuario puede eliminar
        if (!existingUsuario.getId().equals(usuarioActualId)) {
            throw new IllegalStateException("Solo puedes eliminar tu propio usuario");
        }
        // No se puede eliminar un usuario ADMIN
        if (existingUsuario.getRol() == Usuario.Rol.ADMIN) {
            throw new IllegalStateException("No puedes eliminar un usuario ADMIN");
        }
        usuarioRepo.delete(existingUsuario);
    }

    // - DELETE (ADMIN: gestión completa)
    public void delete(Long id) {
        Usuario existingUsuario = usuarioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuarioRepo.delete(existingUsuario);
    }
}
