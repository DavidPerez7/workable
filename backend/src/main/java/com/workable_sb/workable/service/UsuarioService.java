package com.workable_sb.workable.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private MunicipioRepo municipioRepo;

    //- READ
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

    //- CREATE
    public Usuario createPublic(Usuario request) {
        if(usuarioRepo.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("Correo already in use");
        }

        if (request.getRol() == Usuario.Rol.ADMIN) {
            throw new RuntimeException("Cannot register user with ADMIN role");
        }

        Municipio municipio = municipioRepo.findById(request.getMunicipio().getId()).orElseThrow(() -> new RuntimeException("Municipio not found"));
        request.setMunicipio(municipio);

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        request.setPassword(hashedPassword);

        return usuarioRepo.save(request);
    }

    public Usuario create(Usuario request) {
        Municipio municipio = municipioRepo.findById(request.getMunicipio().getId()).orElseThrow(() -> new RuntimeException("Municipio not found"));
        request.setMunicipio(municipio);

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        request.setPassword(hashedPassword);

        return usuarioRepo.save(request);
    }

    //- UPDATE
    public Usuario updatePublic(Long id, Usuario request) {
        if (request.getRol() == Usuario.Rol.ADMIN) {
            throw new RuntimeException("Cannot assign ADMIN role");
        }

        if (usuarioRepo.findByCorreo(request.getCorreo()).isPresent() || request.getCorreo() == null) {
            throw new RuntimeException("Correo already in use or null");
        }

        Usuario existingUsuario = usuarioRepo.findById(id).orElseThrow(() -> new RuntimeException("user not found"));

        existingUsuario.setNombre(request.getNombre());
        existingUsuario.setApellido(request.getApellido());
        existingUsuario.setCorreo(request.getCorreo());
        existingUsuario.setTelefono(request.getTelefono());
        existingUsuario.setUrlFotoPerfil(request.getUrlFotoPerfil());
        existingUsuario.setFechaNacimiento(request.getFechaNacimiento());
        existingUsuario.setIsActive(request.getIsActive());

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        existingUsuario.setPassword(hashedPassword);

        Municipio municipio = municipioRepo.findById(request.getMunicipio().getId()).orElseThrow(() -> new RuntimeException());
        existingUsuario.setMunicipio(municipio);

        return usuarioRepo.save(existingUsuario);
    }

    public Usuario update(Long id, Usuario request) {
        if (usuarioRepo.findByCorreo(request.getCorreo()).isPresent() || request.getCorreo() == null) {
            throw new RuntimeException("Correo already in use or null");
        }

        Usuario existingUsuario = usuarioRepo.findById(id).orElseThrow(() -> new RuntimeException("user not found"));

        existingUsuario.setNombre(request.getNombre());
        existingUsuario.setApellido(request.getApellido());
        existingUsuario.setCorreo(request.getCorreo());
        existingUsuario.setTelefono(request.getTelefono());
        existingUsuario.setUrlFotoPerfil(request.getUrlFotoPerfil());
        existingUsuario.setFechaNacimiento(request.getFechaNacimiento());
        existingUsuario.setIsActive(request.getIsActive());

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        existingUsuario.setPassword(hashedPassword);

        Municipio municipio = municipioRepo.findById(request.getMunicipio().getId()).orElseThrow(() -> new RuntimeException());
        existingUsuario.setMunicipio(municipio);

        return usuarioRepo.save(existingUsuario);
    }

    //- DELETE
    public void deletePublic(Long id) {
        Usuario exisistingUsuario = usuarioRepo.findById(id).orElseThrow(() -> new RuntimeException("Usuarionot found"));

        if (exisistingUsuario.getRol() == Usuario.Rol.ADMIN) {
            throw new RuntimeException("Cannot delete ADMIN user");
        }
        usuarioRepo.delete(exisistingUsuario);
    }

    public void delete(Long id) {
        Usuario exisistingUsuario = usuarioRepo.findById(id).orElseThrow(() -> new RuntimeException("Usuarionot found"));
        usuarioRepo.delete(exisistingUsuario);
    }
}
