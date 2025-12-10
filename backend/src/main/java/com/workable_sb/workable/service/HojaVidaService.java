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

    // ===== CREATE (Manual, solo para ADMIN) =====
    public HojaVida crearHojaVidaManual(HojaVida hojaVida) {
        if (hojaVida.getAspirante() == null || hojaVida.getAspirante().getId() == null) {
            throw new IllegalArgumentException("El aspirante es requerido");
        }
        return hojaVidaRepo.save(hojaVida);
    }

    // ===== READ =====
    public HojaVida obtenerPorId(Long id) {
        return hojaVidaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Hoja de vida no encontrada"));
    }

    public HojaVida obtenerHojaVidaPorAspirante(Long aspiranteId) {
        return hojaVidaRepo.findByAspiranteId(aspiranteId).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("El aspirante no tiene hoja de vida"));
    }

    public List<HojaVida> obtenerTodasLasHojasVida() {
        return hojaVidaRepo.findAll();
    }

    public List<HojaVida> obtenerHojasVidaPublicas() {
        return hojaVidaRepo.findByEsPublicaTrue();
    }

    // ===== UPDATE =====
    public HojaVida actualizarHojaVida(Long id, HojaVida hojaVidaActualizada, Long aspiranteIdActual) {
        HojaVida existente = obtenerPorId(id);

        // Validar que el aspirante actual es el dueño
        if (!existente.getAspirante().getId().equals(aspiranteIdActual)) {
            throw new IllegalStateException("Solo el dueño puede actualizar esta hoja de vida");
        }

        // Actualizar campos opcionales
        if (hojaVidaActualizada.getResumenProfesional() != null) {
            existente.setResumenProfesional(hojaVidaActualizada.getResumenProfesional());
        }
        if (hojaVidaActualizada.getObjetivoProfesional() != null) {
            existente.setObjetivoProfesional(hojaVidaActualizada.getObjetivoProfesional());
        }
        if (hojaVidaActualizada.getRedSocial1() != null) {
            existente.setRedSocial1(hojaVidaActualizada.getRedSocial1());
        }
        if (hojaVidaActualizada.getRedSocial2() != null) {
            existente.setRedSocial2(hojaVidaActualizada.getRedSocial2());
        }
        if (hojaVidaActualizada.getSalarioEsperado() != null) {
            existente.setSalarioEsperado(hojaVidaActualizada.getSalarioEsperado());
        }
        if (hojaVidaActualizada.getIdiomas() != null) {
            existente.setIdiomas(hojaVidaActualizada.getIdiomas());
        }
        if (hojaVidaActualizada.getEsPublica() != null) {
            existente.setEsPublica(hojaVidaActualizada.getEsPublica());
        }

        return hojaVidaRepo.save(existente);
    }

    // ===== DELETE =====
    public void eliminarHojaVida(Long id, Long aspiranteIdActual) {
        HojaVida hojaVida = obtenerPorId(id);

        // Validar que el aspirante actual es el dueño
        if (!hojaVida.getAspirante().getId().equals(aspiranteIdActual)) {
            throw new IllegalStateException("Solo el dueño puede eliminar esta hoja de vida");
        }

        hojaVidaRepo.delete(hojaVida);
    }
}
