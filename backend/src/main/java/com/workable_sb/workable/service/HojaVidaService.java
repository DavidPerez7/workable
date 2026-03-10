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
        return hojaVidaRepo.save(request);
    }

    public HojaVida getById(Long id) {
        return hojaVidaRepo.findById(id).orElseThrow(() -> new RuntimeException("Hoja de vida no encontrada"));
    }

    public HojaVida getByAspiranteId(Long aspiranteId) {
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
        HojaVida existing = getById(id);

        if (request.getResumenProfesional() != null) existing.setResumenProfesional(request.getResumenProfesional());
        if (request.getTelefono() != null) existing.setTelefono(request.getTelefono());
        if (request.getEstudios() != null) existing.setEstudios(request.getEstudios());
        if (request.getExperiencias() != null) existing.setExperiencias(request.getExperiencias());

        return hojaVidaRepo.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        HojaVida existing = getById(id); // valida que exista
        hojaVidaRepo.delete(existing);
    }
}
