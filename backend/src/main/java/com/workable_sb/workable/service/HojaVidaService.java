package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.HojaVida;
import com.workable_sb.workable.repository.AspiranteRepo;
import com.workable_sb.workable.repository.HojaVidaRepo;
import com.workable_sb.workable.security.CustomUserDetails;

@Service
@Transactional
public class HojaVidaService {

    @Autowired
    private HojaVidaRepo hojaVidaRepo;

    @Autowired
    private AspiranteRepo aspiranteRepo;

    // CREATE
    public HojaVida create(HojaVida request, CustomUserDetails user) {
        if (request == null) {
            throw new IllegalArgumentException("La solicitud no puede ser nula");
        }

        if (user == null) {
            throw new IllegalArgumentException("Usuario no autenticado");
        }

        Long aspiranteId = user.getUsuarioId();
        if (aspiranteId == null) {
            throw new IllegalArgumentException("El aspirante es obligatorio");
        }

        Aspirante aspirante = aspiranteRepo.findById(aspiranteId)
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));

        // Verificar si ya existe HdV para este aspirante
        List<HojaVida> existentes = hojaVidaRepo.findByAspirante_Id(aspiranteId);
        if (!existentes.isEmpty()) {
            throw new IllegalArgumentException("El aspirante ya tiene una hoja de vida creada");
        }

        request.setAspirante(aspirante);
        return hojaVidaRepo.save(request);
    }

    public HojaVida getById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        return hojaVidaRepo.findById(id).orElseThrow(() -> new RuntimeException("Hoja de vida no encontrada"));
    }

    public HojaVida getByAspiranteId(Long aspiranteId) {
        if (aspiranteId == null) {
            throw new IllegalArgumentException("El ID del aspirante no puede ser nulo");
        }
        List<HojaVida> hojas = hojaVidaRepo.findByAspirante_Id(aspiranteId);
        if (hojas.isEmpty()) {
            throw new RuntimeException("Hoja de vida no encontrada");
        }
        return hojas.get(0);
    }

    public List<HojaVida> getAll() {
        return hojaVidaRepo.findAll();
    }

    // UPDATE
    public HojaVida update(Long id, HojaVida request, CustomUserDetails user) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        
        if (user == null) {
            throw new IllegalArgumentException("Usuario no autenticado");
        }
        
        HojaVida existing = getById(id);
        
        if (existing == null) {
            throw new RuntimeException("Hoja de vida no encontrada");
        }

        Long aspiranteId = user.getUsuarioId();
        if (!existing.getAspirante().getId().equals(aspiranteId)) {
            throw new IllegalStateException("No tienes permiso para actualizar esta hoja de vida");
        }

        if (request.getResumenProfesional() != null) existing.setResumenProfesional(request.getResumenProfesional());
        if (request.getTelefono() != null) existing.setTelefono(request.getTelefono());
        if (request.getRedSocial() != null) existing.setRedSocial(request.getRedSocial());
        if (request.getCorreoElectronico() != null) existing.setCorreoElectronico(request.getCorreoElectronico());
        if (request.getEstudios() != null) existing.setEstudios(request.getEstudios());
        if (request.getExperiencias() != null) existing.setExperiencias(request.getExperiencias());

        return hojaVidaRepo.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        if (id == null) return;
        HojaVida existing = getById(id); // valida que exista
        if (existing != null) {
            hojaVidaRepo.delete(existing);
        }
    }
}
