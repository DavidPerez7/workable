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
    public HojaVida crearHojaVida(HojaVida hojaVida, Long aspiranteId) {
        
        // Validar que el aspirante existe
        Aspirante aspirante = aspiranteRepo.findById(aspiranteId)
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));

        // Validar campos obligatorios
        if (hojaVida.getTitulo() == null || hojaVida.getTitulo().isEmpty()) {
            throw new IllegalArgumentException("El título es obligatorio");
        }

        hojaVida.setAspirante(aspirante);
        
        return hojaVidaRepo.save(hojaVida);
    }

    // ===== READ =====
    public HojaVida obtenerPorId(Long id) {
        return hojaVidaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Hoja de vida no encontrada"));
    }

    public HojaVida obtenerHojaVidaPorAspirante(Long aspiranteId) {
        return hojaVidaRepo.findFirstByAspiranteIdAndIsActiveOrderByFechaCreacionDesc(aspiranteId, true)
                .orElseThrow(() -> new RuntimeException("El aspirante no tiene hoja de vida activa"));
    }

    public List<HojaVida> obtenerHojasVidaPorUsuario(Long aspiranteId) {
        if (!aspiranteRepo.existsById(aspiranteId)) {
            throw new RuntimeException("Aspirante no encontrado");
        }
        return hojaVidaRepo.findByAspiranteId(aspiranteId);
    }

    public List<HojaVida> obtenerHojasVidaPublicas() {
        return hojaVidaRepo.findByEsPublicaAndIsActive(true, true);
    }

    public List<HojaVida> buscarPorTitulo(String titulo) {
        return hojaVidaRepo.findByTituloContainingIgnoreCaseAndIsActive(titulo, true);
    }

    // ===== UPDATE =====
    public HojaVida actualizarHojaVida(Long id, HojaVida hojaVidaActualizada, Long aspiranteIdActual) {
        HojaVida existente = obtenerPorId(id);

        // Validar que el aspirante actual es el dueño
        if (!puedeModificarHojaVida(existente, aspiranteIdActual)) {
            throw new IllegalStateException("Solo el dueño puede actualizar esta hoja de vida");
        }

        // Actualizar campos
        if (hojaVidaActualizada.getTitulo() != null) {
            existente.setTitulo(hojaVidaActualizada.getTitulo());
        }
        if (hojaVidaActualizada.getResumenProfesional() != null) {
            existente.setResumenProfesional(hojaVidaActualizada.getResumenProfesional());
        }
        if (hojaVidaActualizada.getObjetivoProfesional() != null) {
            existente.setObjetivoProfesional(hojaVidaActualizada.getObjetivoProfesional());
        }
        if (hojaVidaActualizada.getTelefonoAdicional() != null) {
            existente.setTelefonoAdicional(hojaVidaActualizada.getTelefonoAdicional());
        }
        if (hojaVidaActualizada.getLinkedin() != null) {
            existente.setLinkedin(hojaVidaActualizada.getLinkedin());
        }
        if (hojaVidaActualizada.getPortfolio() != null) {
            existente.setPortfolio(hojaVidaActualizada.getPortfolio());
        }
        if (hojaVidaActualizada.getGithub() != null) {
            existente.setGithub(hojaVidaActualizada.getGithub());
        }
        if (hojaVidaActualizada.getDisponibilidad() != null) {
            existente.setDisponibilidad(hojaVidaActualizada.getDisponibilidad());
        }
        if (hojaVidaActualizada.getSalarioEsperado() != null) {
            existente.setSalarioEsperado(hojaVidaActualizada.getSalarioEsperado());
        }
        if (hojaVidaActualizada.getNivelExperiencia() != null) {
            existente.setNivelExperiencia(hojaVidaActualizada.getNivelExperiencia());
        }
        if (hojaVidaActualizada.getIdiomas() != null) {
            existente.setIdiomas(hojaVidaActualizada.getIdiomas());
        }
        if (hojaVidaActualizada.getCertificaciones() != null) {
            existente.setCertificaciones(hojaVidaActualizada.getCertificaciones());
        }
        if (hojaVidaActualizada.getReferencias() != null) {
            existente.setReferencias(hojaVidaActualizada.getReferencias());
        }
        if (hojaVidaActualizada.getLogros() != null) {
            existente.setLogros(hojaVidaActualizada.getLogros());
        }
        if (hojaVidaActualizada.getUrlCvPdf() != null) {
            existente.setUrlCvPdf(hojaVidaActualizada.getUrlCvPdf());
        }
        if (hojaVidaActualizada.getEsPublica() != null) {
            existente.setEsPublica(hojaVidaActualizada.getEsPublica());
        }

        return hojaVidaRepo.save(existente);
    }

    public HojaVida cambiarVisibilidad(Long id, Boolean esPublica, Long aspiranteIdActual) {
        HojaVida existente = obtenerPorId(id);

        if (!puedeModificarHojaVida(existente, aspiranteIdActual)) {
            throw new IllegalStateException("Solo el dueño puede cambiar la visibilidad");
        }

        existente.setEsPublica(esPublica);
        return hojaVidaRepo.save(existente);
    }

    // ===== DELETE =====
    public void eliminarHojaVida(Long id, Long aspiranteIdActual) {
        HojaVida existente = obtenerPorId(id);

        if (!puedeModificarHojaVida(existente, aspiranteIdActual)) {
            throw new IllegalStateException("Solo el dueño puede eliminar esta hoja de vida");
        }

        hojaVidaRepo.delete(existente);
    }

    public void desactivarHojaVida(Long id, Long aspiranteIdActual) {
        HojaVida existente = obtenerPorId(id);

        if (!puedeModificarHojaVida(existente, aspiranteIdActual)) {
            throw new IllegalStateException("Solo el dueño puede desactivar esta hoja de vida");
        }

        existente.setIsActive(false);
        hojaVidaRepo.save(existente);
    }

    // ===== MÉTODOS AUXILIARES =====
    private boolean puedeModificarHojaVida(HojaVida hojaVida, Long aspiranteId) {
        // Es el dueño
        return hojaVida.getAspirante().getId().equals(aspiranteId);
    }
}
