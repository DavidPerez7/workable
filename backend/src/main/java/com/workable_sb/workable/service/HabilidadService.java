package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.Habilidad;
import com.workable_sb.workable.repository.AspiranteRepo;
import com.workable_sb.workable.repository.HabilidadRepo;

/**
 * Servicio de Habilidades - CRUD simple para habilidades del aspirante
 * Las habilidades son simples strings (máx 20 caracteres)
 */
@Service
@Transactional
public class HabilidadService {

    @Autowired
    private HabilidadRepo habilidadRepo;

    @Autowired
    private AspiranteRepo aspiranteRepo;

    // ===== CREATE =====
    public Habilidad crearHabilidad(Habilidad habilidad, Long aspiranteId) {
        // Validar campos obligatorios
        if (habilidad.getNombre() == null || habilidad.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la habilidad es obligatorio");
        }
        
        if (habilidad.getNombre().length() > 20) {
            throw new IllegalArgumentException("La habilidad no puede exceder 20 caracteres");
        }

        // Validar que el aspirante existe
        Aspirante aspirante = aspiranteRepo.findById(aspiranteId)
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));

        habilidad.setAspirante(aspirante);
        return habilidadRepo.save(habilidad);
    }

    // ===== READ =====
    public Habilidad obtenerPorId(Long id) {
        return habilidadRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Habilidad no encontrada con id: " + id));
    }

    public List<Habilidad> obtenerHabilidadesPorUsuario(Long aspiranteId) {
        // Validar que el aspirante existe
        if (!aspiranteRepo.existsById(aspiranteId)) {
            throw new RuntimeException("Aspirante no encontrado con id: " + aspiranteId);
        }
        return habilidadRepo.findByAspiranteIdOrderByNombre(aspiranteId);
    }

    public List<Habilidad> listarTodas() {
        return habilidadRepo.findAll();
    }

    // ===== UPDATE =====
    public Habilidad actualizarHabilidad(Long id, Habilidad habilidadActualizada, Long aspiranteId) {
        Habilidad habilidad = obtenerPorId(id);

        // Validar ownership
        if (!habilidad.getAspirante().getId().equals(aspiranteId)) {
            throw new RuntimeException("No puedes editar habilidades de otro usuario");
        }

        // Actualizar solo el nombre
        if (habilidadActualizada.getNombre() != null && !habilidadActualizada.getNombre().trim().isEmpty()) {
            if (habilidadActualizada.getNombre().length() > 20) {
                throw new IllegalArgumentException("La habilidad no puede exceder 20 caracteres");
            }
            habilidad.setNombre(habilidadActualizada.getNombre().trim());
        }

        return habilidadRepo.save(habilidad);
    }

    // ===== DELETE =====
    public void eliminarHabilidad(Long id, Long aspiranteId) {
        Habilidad habilidad = obtenerPorId(id);

        // Validar ownership
        if (!habilidad.getAspirante().getId().equals(aspiranteId)) {
            throw new RuntimeException("No puedes eliminar habilidades de otro usuario");
        }

        habilidadRepo.delete(habilidad);
    }
}
