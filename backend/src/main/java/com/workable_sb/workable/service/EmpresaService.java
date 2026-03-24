package com.workable_sb.workable.service;

import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.Reclutador;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.ReclutadorRepo;

@Service
@Transactional
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private MunicipioRepo municipioRepo;

    @Autowired
    private ReclutadorRepo reclutadorRepo;

    // CREATE
    public Empresa create(Empresa request, Long usuarioId) {
        if (!isValidNit(request.getNit())) {
            throw new RuntimeException("NIT inválido: debe ser un número de 10 dígitos");
        }

        if (empresaRepository.existsByNit(request.getNit())) {
            throw new RuntimeException("NIT ya está en uso");
        }

        if (request.getMunicipio() != null) {
            Long municipioId = request.getMunicipio().getId();
            if (municipioId != null) {
                Municipio municipio = municipioRepo.findById(municipioId)
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
                request.setMunicipio(municipio);
            }
        }

        // AUTO-GENERAR código de invitación único
        String codigoUnico = generarCodigoInvitacion();
        request.setCodigoInvitacion(codigoUnico);

        Empresa created = empresaRepository.save(request);

        // Si es reclutador, auto-asignar la empresa
        if (usuarioId != null) {
            Reclutador reclutador = reclutadorRepo.findById(usuarioId).orElse(null);
            if (reclutador != null) {
                reclutador.setEmpresa(created);
                reclutadorRepo.save(reclutador);
            }
        }

        return created;
    }

    // Método para generar código de invitación único
    private String generarCodigoInvitacion() {
        String codigo = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        while (empresaRepository.findByCodigoInvitacion(codigo).isPresent()) {
            codigo = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        return codigo;
    }

    // READ ALL
    public List<Empresa> getAll() {
        return empresaRepository.findAll();
    }

    // READ BY ID
    public Empresa getById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        return empresaRepository.findById(id).orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
    }

    // UPDATE
    public Empresa update(Long id, Empresa request) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        Empresa existing = empresaRepository.findById(id).orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        if (request.getNombre() != null) existing.setNombre(request.getNombre());
        if (request.getDescripcion() != null) existing.setDescripcion(request.getDescripcion());
        if (request.getNumeroTrabajadores() != null) existing.setNumeroTrabajadores(request.getNumeroTrabajadores());
        if (request.getEmail() != null) existing.setEmail(request.getEmail());
        if (request.getTelefono() != null) existing.setTelefono(request.getTelefono());
        if (request.getLogoUrl() != null) existing.setLogoUrl(request.getLogoUrl());
        if (request.getCategories() != null) existing.setCategories(request.getCategories());
        if (request.getNit() != null) existing.setNit(request.getNit());

        if (request.getMunicipio() != null) {
            Long municipioId = request.getMunicipio().getId();
            if (municipioId != null) {
                Municipio municipio = municipioRepo.findById(municipioId)
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
                existing.setMunicipio(municipio);
            }
        }

        return empresaRepository.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        if (id == null) return;
        Empresa existing = getById(id);
        if (existing != null) {
            empresaRepository.delete(existing);
        }
    }

    // PUNTUAR EMPRESA
    public void puntuarEmpresa(Long empresaId, Long aspiranteId, float puntuacion) {
        if (puntuacion < 1.0f || puntuacion > 5.0f) {
            throw new IllegalArgumentException("La puntuación debe estar entre 1.0 y 5.0");
        }

        Empresa empresa = getById(empresaId);

        // Verificar si el aspirante ya puntuó
        boolean yaPuntuo = empresa.getPuntuaciones().stream()
            .anyMatch(p -> p.getAspiranteId().equals(aspiranteId));

        if (yaPuntuo) {
            throw new RuntimeException("El aspirante ya ha puntuado esta empresa");
        }

        // Agregar nueva puntuación
        com.workable_sb.workable.models.embedded.EmpresaPuntuacion nuevaPuntuacion =
            new com.workable_sb.workable.models.embedded.EmpresaPuntuacion(
                aspiranteId, puntuacion, java.time.LocalDateTime.now()
            );
        empresa.getPuntuaciones().add(nuevaPuntuacion);

        empresaRepository.save(empresa);
    }

    // VALIDAR NIT COLOMBIANO (MÍNIMO VIABLE: 10 dígitos)
    private boolean isValidNit(String nit) {
        if (nit == null || nit.length() != 10) {
            return false;
        }
        return nit.matches("\\d{10}");
    }
}
