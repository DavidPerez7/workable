package com.workable_sb.workable.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.Habilidad;
import com.workable_sb.workable.models.UsuarioHabilidad;
import com.workable_sb.workable.models.UsuarioHabilidad.NivelDominio;
import com.workable_sb.workable.repository.AspiranteRepo;
import com.workable_sb.workable.repository.HabilidadRepo;
import com.workable_sb.workable.repository.UsuarioHabilidadRepo;

@Service
@Transactional
public class UsuarioHabilidadService {

    @Autowired
    private UsuarioHabilidadRepo usuarioHabilidadRepo;

    @Autowired
    private AspiranteRepo aspiranteRepo;

    @Autowired
    private HabilidadRepo habilidadRepo;

    // ===== CREATE =====
    public UsuarioHabilidad agregarHabilidad(Long aspiranteId, Long habilidadId, 
                                             NivelDominio nivel, Long aspiranteActualId) {

        // Validar permisos: solo el dueño puede agregar
        if (!aspiranteId.equals(aspiranteActualId)) {
            throw new RuntimeException("No tienes permiso para agregar habilidades a este aspirante");
        }

        // Validar que el aspirante existe
        Aspirante aspirante = aspiranteRepo.findById(aspiranteId)
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));

        // Validar que la habilidad existe y está activa
        Habilidad habilidad = habilidadRepo.findById(habilidadId)
                .filter(h -> h.getIsActive())
                .orElseThrow(() -> new RuntimeException("Habilidad no encontrada"));

        // Verificar que no exista ya esa combinación usuario-habilidad
        if (usuarioHabilidadRepo.existsByAspiranteIdAndHabilidadId(aspiranteId, habilidadId)) {
            throw new RuntimeException("El aspirante ya tiene esta habilidad");
        }

        UsuarioHabilidad usuarioHabilidad = new UsuarioHabilidad();
        usuarioHabilidad.setAspirante(aspirante);
        usuarioHabilidad.setHabilidad(habilidad);
        usuarioHabilidad.setNivel(nivel);
        usuarioHabilidad.setFechaAdquisicion(LocalDate.now());
        usuarioHabilidad.setIsActive(true);

        return usuarioHabilidadRepo.save(usuarioHabilidad);
    }

    // ===== READ =====
    public UsuarioHabilidad obtenerPorId(Long id) {

        return usuarioHabilidadRepo.findById(id)
                .filter(uh -> uh.getIsActive())
                .orElseThrow(() -> new RuntimeException("UsuarioHabilidad no encontrado"));
    }

    public List<UsuarioHabilidad> listarPorUsuario(Long aspiranteId) {

        // Validar que el aspirante existe
        if (!aspiranteRepo.existsById(aspiranteId)) {
            throw new RuntimeException("Aspirante no encontrado");
        }

        return usuarioHabilidadRepo.findByAspiranteId(aspiranteId).stream()
                .filter(UsuarioHabilidad::getIsActive)
                .toList();
    }

    public List<UsuarioHabilidad> listarPorUsuarioYNivel(Long aspiranteId, NivelDominio nivel) {

        // Validar que el aspirante existe
        if (!aspiranteRepo.existsById(aspiranteId)) {
            throw new RuntimeException("Aspirante no encontrado");
        }

        return usuarioHabilidadRepo.findByAspiranteIdAndNivel(aspiranteId, nivel).stream()
                .filter(UsuarioHabilidad::getIsActive)
                .toList();
    }

    // ===== UPDATE =====
    public UsuarioHabilidad actualizarNivel(Long id, NivelDominio nuevoNivel, Long aspiranteActualId) {

        UsuarioHabilidad usuarioHabilidad = usuarioHabilidadRepo.findById(id)
                .filter(uh -> uh.getIsActive())
                .orElseThrow(() -> new RuntimeException("UsuarioHabilidad no encontrado"));

        // Validar permisos: solo el dueño
        if (!usuarioHabilidad.getAspirante().getId().equals(aspiranteActualId)) {
            throw new RuntimeException("No tienes permiso para modificar esta habilidad");
        }

        usuarioHabilidad.setNivel(nuevoNivel);
        return usuarioHabilidadRepo.save(usuarioHabilidad);
    }

    public UsuarioHabilidad actualizarFechaAdquisicion(Long id, LocalDate nuevaFecha, Long aspiranteActualId) {

        UsuarioHabilidad usuarioHabilidad = usuarioHabilidadRepo.findById(id)
                .filter(uh -> uh.getIsActive())
                .orElseThrow(() -> new RuntimeException("UsuarioHabilidad no encontrado"));

        // Validar permisos: solo el dueño
        if (!usuarioHabilidad.getAspirante().getId().equals(aspiranteActualId)) {
            throw new RuntimeException("No tienes permiso para modificar esta habilidad");
        }

        // Validar que la fecha no sea futura
        if (nuevaFecha.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de adquisición no puede ser futura");
        }

        usuarioHabilidad.setFechaAdquisicion(nuevaFecha);
        return usuarioHabilidadRepo.save(usuarioHabilidad);
    }

    // ===== DELETE =====
    public void eliminarHabilidad(Long id, Long aspiranteActualId) {
        UsuarioHabilidad usuarioHabilidad = usuarioHabilidadRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("UsuarioHabilidad no encontrado"));

        // Validar permisos: solo el dueño
        if (!usuarioHabilidad.getAspirante().getId().equals(aspiranteActualId)) {
            throw new RuntimeException("No tienes permiso para eliminar esta habilidad");
        }

        usuarioHabilidadRepo.delete(usuarioHabilidad);
    }
}
