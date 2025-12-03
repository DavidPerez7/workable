package com.workable_sb.workable.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Habilidad;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.models.UsuarioHabilidad;
import com.workable_sb.workable.models.UsuarioHabilidad.NivelDominio;
import com.workable_sb.workable.repository.HabilidadRepo;
import com.workable_sb.workable.repository.UsuarioHabilidadRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

@Service
@Transactional
public class UsuarioHabilidadService {

    @Autowired
    private UsuarioHabilidadRepo usuarioHabilidadRepo;

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private HabilidadRepo habilidadRepo;

    // ===== CREATE =====
    public UsuarioHabilidad agregarHabilidad(Long usuarioId, Long habilidadId, 
                                             NivelDominio nivel, Long usuarioActualId) {

        // Validar permisos: solo el dueño o ADMIN pueden agregar
        Usuario usuarioActual = usuarioRepo.findById(usuarioActualId)
                .orElseThrow(() -> new RuntimeException("Usuario actual no encontrado"));

        if (!puedeModificarHabilidades(usuarioId, usuarioActual)) {
            throw new RuntimeException("No tienes permiso para agregar habilidades a este usuario");
        }

        // Validar que el usuario existe
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar que la habilidad existe y está activa
        Habilidad habilidad = habilidadRepo.findById(habilidadId)
                .filter(h -> h.getIsActive())
                .orElseThrow(() -> new RuntimeException("Habilidad no encontrada"));

        // Verificar que no exista ya esa combinación usuario-habilidad
        if (usuarioHabilidadRepo.existsByUsuarioIdAndHabilidadId(usuarioId, habilidadId)) {
            throw new IllegalArgumentException("El usuario ya tiene registrada esta habilidad");
        }

        UsuarioHabilidad usuarioHabilidad = new UsuarioHabilidad();
        usuarioHabilidad.setUsuario(usuario);
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

    public List<UsuarioHabilidad> listarPorUsuario(Long usuarioId) {

        // Validar que el usuario existe
        if (!usuarioRepo.existsById(usuarioId)) {
            throw new RuntimeException("Usuario no encontrado");
        }

        return usuarioHabilidadRepo.findByUsuarioId(usuarioId).stream()
                .filter(UsuarioHabilidad::getIsActive)
                .toList();
    }

    public List<UsuarioHabilidad> listarPorUsuarioYNivel(Long usuarioId, NivelDominio nivel) {

        // Validar que el usuario existe
        if (!usuarioRepo.existsById(usuarioId)) {
            throw new RuntimeException("Usuario no encontrado");
        }

        return usuarioHabilidadRepo.findByUsuarioIdAndNivel(usuarioId, nivel).stream()
                .filter(UsuarioHabilidad::getIsActive)
                .toList();
    }

    // ===== UPDATE =====
    public UsuarioHabilidad actualizarNivel(Long id, NivelDominio nuevoNivel, Long usuarioActualId) {

        UsuarioHabilidad usuarioHabilidad = usuarioHabilidadRepo.findById(id)
                .filter(uh -> uh.getIsActive())
                .orElseThrow(() -> new RuntimeException("UsuarioHabilidad no encontrado"));

        // Validar permisos
        Usuario usuarioActual = usuarioRepo.findById(usuarioActualId)
                .orElseThrow(() -> new RuntimeException("Usuario actual no encontrado"));

        if (!puedeModificarHabilidades(usuarioHabilidad.getUsuario().getId(), usuarioActual)) {
            throw new RuntimeException("No tienes permiso para modificar esta habilidad");
        }

        usuarioHabilidad.setNivel(nuevoNivel);
        return usuarioHabilidadRepo.save(usuarioHabilidad);
    }

    public UsuarioHabilidad actualizarFechaAdquisicion(Long id, LocalDate nuevaFecha, Long usuarioActualId) {

        UsuarioHabilidad usuarioHabilidad = usuarioHabilidadRepo.findById(id)
                .filter(uh -> uh.getIsActive())
                .orElseThrow(() -> new RuntimeException("UsuarioHabilidad no encontrado"));

        // Validar permisos
        Usuario usuarioActual = usuarioRepo.findById(usuarioActualId)
                .orElseThrow(() -> new RuntimeException("Usuario actual no encontrado"));

        if (!puedeModificarHabilidades(usuarioHabilidad.getUsuario().getId(), usuarioActual)) {
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
    public void eliminarHabilidad(Long id, Long usuarioActualId) {

        UsuarioHabilidad usuarioHabilidad = usuarioHabilidadRepo.findById(id)
                .filter(uh -> uh.getIsActive())
                .orElseThrow(() -> new RuntimeException("UsuarioHabilidad no encontrado"));

        // Validar permisos
        Usuario usuarioActual = usuarioRepo.findById(usuarioActualId)
                .orElseThrow(() -> new RuntimeException("Usuario actual no encontrado"));

        if (!puedeModificarHabilidades(usuarioHabilidad.getUsuario().getId(), usuarioActual)) {
            throw new RuntimeException("No tienes permiso para eliminar esta habilidad");
        }

        usuarioHabilidad.setIsActive(false);
        usuarioHabilidadRepo.save(usuarioHabilidad);
    }

    public void eliminarHabilidadFisica(Long id) {

        if (!usuarioHabilidadRepo.existsById(id)) {
            throw new RuntimeException("UsuarioHabilidad no encontrado");
        }

        usuarioHabilidadRepo.deleteById(id);
    }

    private boolean puedeModificarHabilidades(Long usuarioIdObjetivo, Usuario usuarioActual) {
        // ADMIN puede modificar cualquier habilidad
        if (usuarioActual.getRol() == Usuario.Rol.ADMIN) {
            return true;
        }

        // El usuario solo puede modificar sus propias habilidades
        return usuarioActual.getId().equals(usuarioIdObjetivo);
    }
}
