package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.models.Experiencia.Estado;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.ExperienciaRepo;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

@Service
@Transactional
public class ExperienciaService {

    @Autowired
    private ExperienciaRepo experienciaRepo;

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private MunicipioRepo municipioRepo;

    // ===== CREACIÓN =====
    public Experiencia crearExperiencia(Experiencia experiencia, Long usuarioId) {
        if (experiencia == null) throw new IllegalArgumentException("Experiencia no puede ser null");
        if (usuarioId == null) throw new IllegalArgumentException("UsuarioId requerido");

        // Validar campos obligatorios
        if (experiencia.getCargo() == null || experiencia.getCargo().isEmpty()) {
            throw new IllegalArgumentException("El cargo es obligatorio");
        }
        if (experiencia.getEmpresa() == null || experiencia.getEmpresa().isEmpty()) {
            throw new IllegalArgumentException("La empresa es obligatoria");
        }
        if (experiencia.getFechaInicio() == null) {
            throw new IllegalArgumentException("La fecha de inicio es obligatoria");
        }

        // Validar que el usuario existe
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Solo ASPIRANTE puede tener experiencias (ADMIN puede crear para cualquier aspirante)
        if (usuario.getRol() != Usuario.Rol.ASPIRANTE) {
            throw new IllegalArgumentException("Solo usuarios con rol ASPIRANTE pueden tener experiencias");
        }

        // Validar municipio
        if (experiencia.getMunicipio() != null) {
            municipioRepo.findById(experiencia.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
        }

        // Asignar usuario
        experiencia.setUsuario(usuario);

        // Guardar (validaciones de fechas en @PrePersist)
        return experienciaRepo.save(experiencia);
    }

    // ===== CONSULTAS =====
    public Experiencia obtenerPorId(Long id) {
        return experienciaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Experiencia no encontrada con id: " + id));
    }

    public List<Experiencia> obtenerExperienciasPorUsuario(Long usuarioId) {
        // Validar que el usuario existe
        if (!usuarioRepo.existsById(usuarioId)) {
            throw new RuntimeException("Usuario no encontrado con id: " + usuarioId);
        }
        return experienciaRepo.findByUsuarioId(usuarioId);
    }

    public List<Experiencia> obtenerExperienciasActivas(Long usuarioId) {
        if (!usuarioRepo.existsById(usuarioId)) {
            throw new RuntimeException("Usuario no encontrado con id: " + usuarioId);
        }
        return experienciaRepo.findByUsuarioIdAndEstado(usuarioId, Estado.ACTIVO);
    }

    public List<Experiencia> obtenerExperienciasOrdenadasPorFecha(Long usuarioId) {
        if (!usuarioRepo.existsById(usuarioId)) {
            throw new RuntimeException("Usuario no encontrado con id: " + usuarioId);
        }
        return experienciaRepo.findByUsuarioIdOrderByFechaInicioDesc(usuarioId);
    }

    public List<Experiencia> listarTodas() {
        return experienciaRepo.findAll();
    }

    // ===== ACTUALIZACIÓN (dueño o ADMIN) =====
    public Experiencia actualizarExperiencia(Long id, Experiencia experienciaActualizada, Long usuarioIdActual) {
        Experiencia existente = obtenerPorId(id);

        // Validar que el usuario actual es el dueño o ADMIN
        if (!puedeModificarExperiencia(existente, usuarioIdActual)) {
            throw new IllegalStateException("Solo el dueño o un administrador pueden actualizar esta experiencia");
        }

        // Actualizar campos permitidos
        existente.setCargo(experienciaActualizada.getCargo());
        existente.setEmpresa(experienciaActualizada.getEmpresa());
        existente.setDescripcion(experienciaActualizada.getDescripcion());
        existente.setFechaInicio(experienciaActualizada.getFechaInicio());
        existente.setFechaFin(experienciaActualizada.getFechaFin());

        if (experienciaActualizada.getMunicipio() != null) {
            municipioRepo.findById(experienciaActualizada.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
            existente.setMunicipio(experienciaActualizada.getMunicipio());
        }

        // Guardar (validaciones en @PreUpdate)
        return experienciaRepo.save(existente);
    }

    // ===== ELIMINACIÓN (soft delete - dueño o ADMIN) =====
    public void eliminarExperiencia(Long id, Long usuarioIdActual) {
        Experiencia existente = obtenerPorId(id);

        // Validar que el usuario actual es el dueño o ADMIN
        if (!puedeModificarExperiencia(existente, usuarioIdActual)) {
            throw new IllegalStateException("Solo el dueño o un administrador pueden eliminar esta experiencia");
        }

        // Soft delete
        existente.setEstado(Estado.INACTIVO);
        experienciaRepo.save(existente);
    }

    // ===== ELIMINACIÓN FÍSICA (solo ADMIN) =====
    public void eliminarExperienciaFisica(Long id, String correoUsuarioActual) {
        // Validar que el usuario actual es ADMIN
        Usuario usuarioActual = usuarioRepo.findByCorreo(correoUsuarioActual)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuarioActual.getRol() != Usuario.Rol.ADMIN) {
            throw new IllegalStateException("Solo administradores pueden eliminar experiencias físicamente");
        }

        // Verificar que la experiencia existe
        if (!experienciaRepo.existsById(id)) {
            throw new RuntimeException("Experiencia no encontrada con id: " + id);
        }

        // Eliminación física
        experienciaRepo.deleteById(id);
    }

    // ===== CAMBIAR ESTADO (dueño o ADMIN) =====
    public Experiencia cambiarEstado(Long id, Estado nuevoEstado, Long usuarioIdActual) {
        Experiencia existente = obtenerPorId(id);

        // Validar que el usuario actual es el dueño o ADMIN
        if (!puedeModificarExperiencia(existente, usuarioIdActual)) {
            throw new IllegalStateException("Solo el dueño o un administrador pueden cambiar el estado");
        }

        existente.setEstado(nuevoEstado);
        return experienciaRepo.save(existente);
    }

    // ===== MÉTODOS AUXILIARES =====
    /**
     * Verifica si un usuario puede modificar una experiencia (es el dueño o es ADMIN)
     */
    private boolean puedeModificarExperiencia(Experiencia experiencia, Long usuarioId) {
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Es el dueño o es ADMIN
        return experiencia.getUsuario().getId().equals(usuarioId) || 
               usuario.getRol() == Usuario.Rol.ADMIN;
    }
}
