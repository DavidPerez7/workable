package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.HojaVida;
import com.workable_sb.workable.repository.HojaVidaRepo;

@Service
@Transactional
public class HojaVidaService {

    @Autowired
    private HojaVidaRepo hojaVidaRepo;

    // CREATE
    public HojaVida create(HojaVida request) {
        if (request == null) {
            throw new IllegalArgumentException("La solicitud no puede ser nula");
        }
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
        List<HojaVida> hojas = hojaVidaRepo.findByAspiranteId(aspiranteId);
        if (hojas.isEmpty()) {
            throw new RuntimeException("Hoja de vida no encontrada");
        }
        return hojas.get(0);
    }

    public List<HojaVida> getAll() {
        return hojaVidaRepo.findAll();
    }

    // UPDATE
    public HojaVida update(Long id, HojaVida request) {
        if (id == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo");
        }
        HojaVida existing = getById(id);
        
        if (existing == null) {
            throw new RuntimeException("Hoja de vida no encontrada");
        }

        if (request.getResumenProfesional() != null) existing.setResumenProfesional(request.getResumenProfesional());
        if (request.getTelefono() != null) existing.setTelefono(request.getTelefono());
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
