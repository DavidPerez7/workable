package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Habilidad;
import com.workable_sb.workable.models.Habilidad.TipoHabilidad;
import com.workable_sb.workable.repository.HabilidadRepo;
import com.workable_sb.workable.repository.UsuarioHabilidadRepo;

@Service
@Transactional
public class HabilidadService {

    @Autowired
    private HabilidadRepo habilidadRepo;

    @Autowired
    private UsuarioHabilidadRepo usuarioHabilidadRepo;

    // ===== CREATE =====
    public Habilidad crearHabilidad(Habilidad habilidad, Long usuarioId) {

        // Validar campos obligatorios
        if (habilidad.getNombre() == null || habilidad.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la habilidad es obligatorio");
        }
        if (habilidad.getTipo() == null) {
            throw new IllegalArgumentException("El tipo de habilidad es obligatorio");
        }

        // Verificar que no exista otra habilidad con el mismo nombre
        if (habilidadRepo.existsByNombre(habilidad.getNombre())) {
            throw new IllegalArgumentException("Ya existe una habilidad con ese nombre");
        }

        habilidad.setIsActive(true);
        return habilidadRepo.save(habilidad);
    }

    // ===== READ =====
    public Habilidad obtenerPorId(Long id) {

        return habilidadRepo.findById(id)
                .filter(h -> h.getIsActive())
                .orElseThrow(() -> new RuntimeException("Habilidad no encontrada"));
    }

    public List<Habilidad> listarActivas() {
        return habilidadRepo.findAll().stream()
                .filter(Habilidad::getIsActive)
                .toList();
    }

    public List<Habilidad> listarPorTipo(TipoHabilidad tipo) {

        return habilidadRepo.findByTipo(tipo).stream()
                .filter(Habilidad::getIsActive)
                .toList();
    }

    public Habilidad buscarPorNombre(String nombre) {

        return habilidadRepo.findByNombre(nombre)
                .filter(h -> h.getIsActive())
                .orElseThrow(() -> new RuntimeException("Habilidad no encontrada"));
    }

    public List<Habilidad> buscarPorNombreParcial(String texto) {

        return habilidadRepo.findByNombreContainingIgnoreCase(texto).stream()
                .filter(Habilidad::getIsActive)
                .toList();
    }

    // ===== UPDATE =====
    public Habilidad actualizarHabilidad(Long id, Habilidad habilidadActualizada, Long usuarioId) {

        Habilidad habilidadExistente = habilidadRepo.findById(id)
                .filter(h -> h.getIsActive())
                .orElseThrow(() -> new RuntimeException("Habilidad no encontrada"));

        // Validar que el nuevo nombre no esté ya en uso (por otra habilidad)
        if (habilidadActualizada.getNombre() != null && 
            !habilidadActualizada.getNombre().equals(habilidadExistente.getNombre())) {
            
            if (habilidadRepo.existsByNombre(habilidadActualizada.getNombre())) {
                throw new IllegalArgumentException("Ya existe una habilidad con ese nombre");
            }
            habilidadExistente.setNombre(habilidadActualizada.getNombre());
        }

        if (habilidadActualizada.getTipo() != null) {
            habilidadExistente.setTipo(habilidadActualizada.getTipo());
        }

        return habilidadRepo.save(habilidadExistente);
    }

    // ===== DELETE =====
    public void eliminarHabilidad(Long id) {
        Habilidad habilidad = habilidadRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Habilidad no encontrada"));

        // Eliminar todas las relaciones usuario-habilidad primero
        usuarioHabilidadRepo.deleteAll(usuarioHabilidadRepo.findByHabilidadId(id));
        
        // Luego eliminar la habilidad
        habilidadRepo.delete(habilidad);
    }
}