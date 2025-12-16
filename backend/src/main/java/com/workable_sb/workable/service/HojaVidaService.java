package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.HojaVida;
import com.workable_sb.workable.repository.AspiranteRepo;
import com.workable_sb.workable.repository.HojaVidaRepo;

@Service
@Transactional
public class HojaVidaService {

    @Autowired
    private HojaVidaRepo hojaVidaRepo;

    @Autowired
    private AspiranteRepo aspiranteRepo;

    // ===== CREATE =====
    public HojaVida create(HojaVida hojaVida) {
        if (hojaVida.getAspirante() == null || hojaVida.getAspirante().getId() == null) {
            throw new IllegalArgumentException("El aspirante es requerido");
        }
        return hojaVidaRepo.save(hojaVida);
    }

    // ===== READ =====
    public HojaVida getById(Long id) {
        return hojaVidaRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Hoja de vida no encontrada"));
    }

    public HojaVida getByAspiranteId(Long aspiranteId) {
        return hojaVidaRepo.findByAspiranteId(aspiranteId).stream().findFirst()
            .orElseGet(() -> {
                Aspirante aspirante = aspiranteRepo.findById(aspiranteId)
                    .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));
                HojaVida nuevaHojaVida = new HojaVida();
                nuevaHojaVida.setAspirante(aspirante);
                nuevaHojaVida.setEsPublica(false);
                return hojaVidaRepo.save(nuevaHojaVida);
            });
    }

    public List<HojaVida> getAll() {
        return hojaVidaRepo.findAll();
    }

    // ===== UPDATE =====
    public HojaVida update(Long id, HojaVida request) {
        HojaVida existing = getById(id);

        if (request.getResumenProfesional() != null) {
            existing.setResumenProfesional(request.getResumenProfesional());
        }
        if (request.getObjetivoProfesional() != null) {
            existing.setObjetivoProfesional(request.getObjetivoProfesional());
        }
        if (request.getRedSocial1() != null) {
            existing.setRedSocial1(request.getRedSocial1());
        }
        if (request.getContactoEmail() != null) {
            String nuevoCorreo = request.getContactoEmail();
            Aspirante aspirante = existing.getAspirante();
            if (aspirante == null) throw new RuntimeException("Aspirante asociado no encontrado");
            if (!nuevoCorreo.equals(aspirante.getCorreo())) {
                if (aspiranteRepo.findByCorreo(nuevoCorreo).isPresent()) {
                    throw new RuntimeException("El correo ya está en uso por otro aspirante");
                }
                aspirante.setCorreo(nuevoCorreo);
            }
            existing.setContactoEmail(nuevoCorreo);
            aspiranteRepo.save(aspirante);
        }
        if (request.getTelefono() != null) {
            String nuevoTelefono = request.getTelefono();
            Aspirante aspirante = existing.getAspirante();
            if (aspirante == null) throw new RuntimeException("Aspirante asociado no encontrado");
            aspirante.setTelefono(nuevoTelefono);
            existing.setTelefono(nuevoTelefono);
            aspiranteRepo.save(aspirante);
        }
        if (request.getIdiomas() != null) {
            existing.setIdiomas(request.getIdiomas());
        }
        if (request.getEsPublica() != null) {
            existing.setEsPublica(request.getEsPublica());
        }
        
        // Actualizar estudios y experiencias si vienen en el request
        if (request.getEstudios() != null) {
            existing.setEstudios(request.getEstudios());
        }
        if (request.getExperiencias() != null) {
            existing.setExperiencias(request.getExperiencias());
        }

        return hojaVidaRepo.save(existing);
    }

    // ===== DELETE =====
    public void delete(Long id) {
        HojaVida hojaVida = getById(id);
        hojaVidaRepo.delete(hojaVida);
    }
}
