package com.workable_sb.workable.service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.HojaVida;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.repository.AspiranteRepo;
import com.workable_sb.workable.repository.HojaVidaRepo;
import com.workable_sb.workable.repository.MunicipioRepo;

@Service
@Transactional
public class AspiranteService {
    @Autowired
    private AspiranteRepo aspiranteRepo;

    @Autowired
    private HojaVidaRepo hojaVidaRepo;

    @Autowired
    private MunicipioRepo municipioRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // CREATE
    public Aspirante create(Aspirante request) {
        if (aspiranteRepo.findByCorreo(request.getCorreo()).isPresent()) {throw new RuntimeException("Correo ya está en uso");}

        request.setPassword(passwordEncoder.encode(request.getPassword()));
        Aspirante aspirante = aspiranteRepo.save(request);

        HojaVida hojaVida = new HojaVida();
        hojaVida.setAspirante(aspirante);
        hojaVidaRepo.save(hojaVida);

        return aspirante;
    }


    // READ
    public List<Aspirante> getAll() {
        return aspiranteRepo.findAll();
    }

    public Optional<Aspirante> getById(Long id) {
        return aspiranteRepo.findById(id);
    }

    public Optional<Aspirante> getByCorreo(String correo) {
        return aspiranteRepo.findByCorreo(correo);
    }


    // UPDATE
    public Aspirante update(Long id, Aspirante request) {
        Aspirante existing = aspiranteRepo.findById(id).orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));

        if (!Objects.equals(existing.getCorreo(), request.getCorreo())) {
            if (aspiranteRepo.findByCorreo(request.getCorreo()).isPresent()) {
                throw new RuntimeException("Correo usado por otro usuario");
            }
            existing.setCorreo(request.getCorreo());
        }

        if (request.getNombre() != null) existing.setNombre(request.getNombre());
        if (request.getApellido() != null) existing.setApellido(request.getApellido());
        if (request.getTelefono() != null) existing.setTelefono(request.getTelefono());
        if (request.getUrlFotoPerfil() != null) existing.setUrlFotoPerfil(request.getUrlFotoPerfil());
        if (request.getFechaNacimiento() != null) existing.setFechaNacimiento(request.getFechaNacimiento());
        if (request.getGenero() != null) existing.setGenero(request.getGenero());
        if (request.getUbicacion() != null) existing.setUbicacion(request.getUbicacion());
        if (request.getIsActive() != null) existing.setIsActive(request.getIsActive());
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getMunicipio() != null && request.getMunicipio().getId() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
            existing.setMunicipio(municipio);
        }

        return aspiranteRepo.save(existing);
    }


    // DELETE
    public void delete(Long id) {
        aspiranteRepo.deleteById(id); // getById ya valida que exista
    }
}
