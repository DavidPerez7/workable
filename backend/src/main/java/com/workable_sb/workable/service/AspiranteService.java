package com.workable_sb.workable.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    // - READ
    public List<Aspirante> getAll() {
        return aspiranteRepo.findAll();
    }

    public Optional<Aspirante> getById(Long id) {
        return aspiranteRepo.findById(id);
    }

    public Optional<Aspirante> getByCorreo(String correo) {
        return aspiranteRepo.findByCorreo(correo);
    }

    public Optional<Aspirante> getByNombre(String nombre) {
        return aspiranteRepo.findByNombre(nombre);
    }

    // - CREATE
    public Aspirante createPublic(Aspirante request) {
        // Validación de contraseña requerida
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("La contraseña es requerida");
        }
        
        // Solo validación de correo único
        if (aspiranteRepo.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("Correo already in use");
        }

        // Municipio es opcional, solo validar si se proporciona
        if (request.getMunicipio() != null && request.getMunicipio().getId() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId()).orElseThrow(() -> new RuntimeException("Municipio not found"));
            request.setMunicipio(municipio);
        } else {
            request.setMunicipio(null);
        }

        request.setPassword(passwordEncoder.encode(request.getPassword()));
        Aspirante aspirante = aspiranteRepo.save(request);
        
        // Crear HojaVida automáticamente
        crearHojaVidaAutomatica(aspirante);
        
        return aspirante;
    }

    public Aspirante create(Aspirante request) {
        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId()).orElseThrow(() -> new RuntimeException("Municipio not found"));
            request.setMunicipio(municipio);
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            request.setPassword(passwordEncoder.encode("123456"));
        } else {
            request.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        // Si no se proporciona fechaNacimiento, usar una fecha por defecto
        if (request.getFechaNacimiento() == null) {
            request.setFechaNacimiento(java.time.LocalDate.of(1990, 1, 1));
        }
        Aspirante aspirante = aspiranteRepo.save(request);
        
        // Crear HojaVida automáticamente
        crearHojaVidaAutomatica(aspirante);
        
        return aspirante;
    }

    // Método privado para crear HojaVida automáticamente
    private void crearHojaVidaAutomatica(Aspirante aspirante) {
        HojaVida hojaVida = new HojaVida();
        hojaVida.setAspirante(aspirante);
        hojaVida.setEsPublica(false);
        hojaVidaRepo.save(hojaVida);
    }

    // - UPDATE (PUBLICO: solo el propio aspirante)
    public Aspirante updatePublic(Long id, Aspirante request, Long aspiranteActualId) {
        Aspirante existingAspirante = aspiranteRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));

        // Solo el propio aspirante puede actualizar
        if (!existingAspirante.getId().equals(aspiranteActualId)) {
            throw new IllegalStateException("Solo puedes actualizar tu propio perfil");
        }
        
        // Validar correo único (solo si cambió)
        if (!existingAspirante.getCorreo().equals(request.getCorreo())) {
            if (aspiranteRepo.findByCorreo(request.getCorreo()).isPresent()) {
                throw new RuntimeException("Correo already in use");
            }
            existingAspirante.setCorreo(request.getCorreo());
        }
        existingAspirante.setNombre(request.getNombre());
        existingAspirante.setApellido(request.getApellido());
        existingAspirante.setTelefono(request.getTelefono());
        existingAspirante.setUrlFotoPerfil(request.getUrlFotoPerfil());
        existingAspirante.setFechaNacimiento(request.getFechaNacimiento());
        existingAspirante.setDescripcion(request.getDescripcion());
        existingAspirante.setGenero(request.getGenero());
        existingAspirante.setUbicacion(request.getUbicacion());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existingAspirante.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio not found"));
            existingAspirante.setMunicipio(municipio);
        }
        return aspiranteRepo.save(existingAspirante);
    }

    // - UPDATE (ADMIN: gestión completa)
    public Aspirante update(Long id, Aspirante request) {
        Aspirante existingAspirante = aspiranteRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));
        
        // Solo actualizar correo si viene en el request y es diferente
        if (request.getCorreo() != null && !existingAspirante.getCorreo().equals(request.getCorreo())) {
            if (aspiranteRepo.findByCorreo(request.getCorreo()).isPresent()) {
                throw new RuntimeException("Correo already in use");
            }
            existingAspirante.setCorreo(request.getCorreo());
        }
        
        if (request.getNombre() != null) existingAspirante.setNombre(request.getNombre());
        if (request.getApellido() != null) existingAspirante.setApellido(request.getApellido());
        if (request.getTelefono() != null) existingAspirante.setTelefono(request.getTelefono());
        if (request.getUrlFotoPerfil() != null) existingAspirante.setUrlFotoPerfil(request.getUrlFotoPerfil());
        if (request.getFechaNacimiento() != null) existingAspirante.setFechaNacimiento(request.getFechaNacimiento());
        if (request.getIsActive() != null) existingAspirante.setIsActive(request.getIsActive());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existingAspirante.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio not found"));
            existingAspirante.setMunicipio(municipio);
        }
        // Campos específicos
        if (request.getDescripcion() != null) existingAspirante.setDescripcion(request.getDescripcion());
        if (request.getGenero() != null) existingAspirante.setGenero(request.getGenero());
        if (request.getUbicacion() != null) existingAspirante.setUbicacion(request.getUbicacion());
        return aspiranteRepo.save(existingAspirante);
    }

    // - UPDATE MI PERFIL (usando token JWT)
    public Aspirante updateMiPerfil(Long id, Aspirante request) {
        // Obtener el usuario autenticado del contexto de seguridad
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String correoAuth = auth.getName();
        Aspirante aspiranteAuth = aspiranteRepo.findByCorreo(correoAuth)
                .orElseThrow(() -> new RuntimeException("Aspirante autenticado no encontrado"));

        // Validar que el usuario autenticado esté actualizando su propio perfil
        if (!aspiranteAuth.getId().equals(id)) {
            throw new IllegalStateException("Solo puedes actualizar tu propio perfil");
        }

        Aspirante existingAspirante = aspiranteRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));

        // Actualizar solo los campos que vienen en el request (actualización parcial)
        if (request.getNombre() != null && !request.getNombre().isEmpty()) {
            existingAspirante.setNombre(request.getNombre());
        }
        if (request.getApellido() != null && !request.getApellido().isEmpty()) {
            existingAspirante.setApellido(request.getApellido());
        }
        if (request.getCorreo() != null && !request.getCorreo().isEmpty()) {
            // Validar que el correo no esté en uso (a menos que sea el mismo)
            if (!existingAspirante.getCorreo().equals(request.getCorreo())) {
                if (aspiranteRepo.findByCorreo(request.getCorreo()).isPresent()) {
                    throw new RuntimeException("El correo ya está en uso");
                }
            }
            existingAspirante.setCorreo(request.getCorreo());
        }
        if (request.getTelefono() != null) {
            existingAspirante.setTelefono(request.getTelefono());
        }
        if (request.getFechaNacimiento() != null) {
            existingAspirante.setFechaNacimiento(request.getFechaNacimiento());
        }
        if (request.getGenero() != null) {
            existingAspirante.setGenero(request.getGenero());
        }
        if (request.getDescripcion() != null) {
            existingAspirante.setDescripcion(request.getDescripcion());
        }
        if (request.getUbicacion() != null) {
            existingAspirante.setUbicacion(request.getUbicacion());
        }
        if (request.getMunicipio() != null && request.getMunicipio().getId() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
            existingAspirante.setMunicipio(municipio);
        }
        if (request.getUrlFotoPerfil() != null) {
            existingAspirante.setUrlFotoPerfil(request.getUrlFotoPerfil());
        }

        return aspiranteRepo.save(existingAspirante);
    }

    // - DELETE PUBLICO: solo el propio aspirante
    public void deletePublic(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String correoAuth = auth.getName();
        Aspirante aspiranteAuth = aspiranteRepo.findByCorreo(correoAuth).orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));
        Long idAuth = aspiranteAuth.getId(); // ID real del aspirante autenticado

        //Ahora validar que el ID a eliminar sea el mismo
        if (!id.equals(idAuth)) {
            throw new IllegalStateException("Solo puedes eliminar tu propio perfil");
        }

        Aspirante existingAspirante = aspiranteRepo.findById(idAuth).orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));
        aspiranteRepo.delete(existingAspirante);
    }

    // - DELETE (ADMIN: gestión completa)
    public void delete(Long id) {
        Aspirante existingAspirante = aspiranteRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));
        aspiranteRepo.delete(existingAspirante);
    }
}