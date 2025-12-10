package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.Habilidad;
import com.workable_sb.workable.models.Habilidad.Estado;
import com.workable_sb.workable.repository.AspiranteRepo;
import com.workable_sb.workable.repository.HabilidadRepo;

/**
 * Servicio de Habilidades - CRUD completo para habilidades del aspirante
 * Incluye validaciones de ownership y estados.
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
        if (habilidad.getNombre() == null || habilidad.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la habilidad es obligatorio");
        }

        // Validar que el aspirante existe
        Aspirante aspirante = aspiranteRepo.findById(aspiranteId)
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));

        habilidad.setAspirante(aspirante);
        
        // Si no se especifica nivel, usar INTERMEDIO por defecto
        if (habilidad.getNivel() == null) {
            habilidad.setNivel(Habilidad.Nivel.INTERMEDIO);
        }
        
        habilidad.setEstado(Estado.ACTIVO);

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
        return habilidadRepo.findByAspiranteId(aspiranteId);
    }

    public List<Habilidad> obtenerHabilidadesActivas(Long aspiranteId) {
        if (!aspiranteRepo.existsById(aspiranteId)) {
            throw new RuntimeException("Aspirante no encontrado con id: " + aspiranteId);
        }
        return habilidadRepo.findByAspiranteIdAndEstado(aspiranteId, Estado.ACTIVO);
    }

    public List<Habilidad> obtenerHabilidadesOrdenadasPorNombre(Long aspiranteId) {
        if (!aspiranteRepo.existsById(aspiranteId)) {
            throw new RuntimeException("Aspirante no encontrado con id: " + aspiranteId);
        }
        return habilidadRepo.findByAspiranteIdOrderByNombre(aspiranteId);
    }

    public List<Habilidad> listarTodas() {
        return habilidadRepo.findAll();
    }

    public List<Habilidad> obtenerPorNombre(String nombre) {
        return habilidadRepo.findByNombre(nombre);
    }

    // ===== UPDATE =====
    public Habilidad actualizarHabilidad(Long id, Habilidad habilidadActualizada, Long aspiranteId) {
        Habilidad habilidad = obtenerPorId(id);

        // Validar ownership
        if (!habilidad.getAspirante().getId().equals(aspiranteId)) {
            throw new RuntimeException("No puedes editar habilidades de otro usuario");
        }

        // Actualizar solo los campos permitidos
        if (habilidadActualizada.getNombre() != null && !habilidadActualizada.getNombre().isEmpty()) {
            habilidad.setNombre(habilidadActualizada.getNombre());
        }

        if (habilidadActualizada.getDescripcion() != null) {
            habilidad.setDescripcion(habilidadActualizada.getDescripcion());
        }

        if (habilidadActualizada.getNivel() != null) {
            habilidad.setNivel(habilidadActualizada.getNivel());
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

    public void desactivarHabilidad(Long id, Long aspiranteId) {
        Habilidad habilidad = obtenerPorId(id);

        // Validar ownership
        if (!habilidad.getAspirante().getId().equals(aspiranteId)) {
            throw new RuntimeException("No puedes desactivar habilidades de otro usuario");
        }

        habilidad.setEstado(Estado.INACTIVO);
        habilidadRepo.save(habilidad);
    }

    public void activarHabilidad(Long id, Long aspiranteId) {
        Habilidad habilidad = obtenerPorId(id);

        // Validar ownership
        if (!habilidad.getAspirante().getId().equals(aspiranteId)) {
            throw new RuntimeException("No puedes activar habilidades de otro usuario");
        }

        habilidad.setEstado(Estado.ACTIVO);
        habilidadRepo.save(habilidad);
    }
}
