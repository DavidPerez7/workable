package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Estudio;
import com.workable_sb.workable.models.Estudio.NivelEducativo;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.EstudioRepo;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

@Service
@Transactional
public class EstudioService {

    @Autowired
    private EstudioRepo estudioRepo;

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private MunicipioRepo municipioRepo;

    // ===== CREATE =====
    public Estudio crearEstudio(Estudio estudio, Long usuarioId) {

        // Validar campos obligatorios
        if (estudio.getTitulo() == null || estudio.getTitulo().isEmpty()) {
            throw new IllegalArgumentException("El título del estudio es obligatorio");
        }
        if (estudio.getInstitucion() == null || estudio.getInstitucion().isEmpty()) {
            throw new IllegalArgumentException("La institución es obligatoria");
        }
        if (estudio.getFechaInicio() == null) {
            throw new IllegalArgumentException("La fecha de inicio es obligatoria");
        }
        if (estudio.getNivelEducativo() == null) {
            throw new IllegalArgumentException("El nivel educativo es obligatorio");
        }

        // Validar que el usuario existe
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar municipio
        if (estudio.getMunicipio() != null) {
            municipioRepo.findById(estudio.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
        }

        // Validar que si no está en curso, debe tener fecha fin
        if (!estudio.getEnCurso() && estudio.getFechaFin() == null) {
            throw new IllegalArgumentException("Un estudio finalizado debe tener fecha de fin");
        }

        estudio.setUsuario(usuario);

        return estudioRepo.save(estudio);
    }

    // ===== READ =====
    public Estudio obtenerPorId(Long id) {
        return estudioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Estudio no encontrado con id: " + id));
    }

    public List<Estudio> obtenerEstudiosPorUsuario(Long usuarioId) {
        // Validar que el usuario existe
        if (!usuarioRepo.existsById(usuarioId)) {
            throw new RuntimeException("Usuario no encontrado con id: " + usuarioId);
        }
        return estudioRepo.findByUsuarioId(usuarioId);
    }

    public List<Estudio> obtenerEstudiosEnCurso(Long usuarioId) {
        if (!usuarioRepo.existsById(usuarioId)) {
            throw new RuntimeException("Usuario no encontrado con id: " + usuarioId);
        }
        return estudioRepo.findByUsuarioIdAndEnCurso(usuarioId, true);
    }

    public List<Estudio> obtenerEstudiosPorNivel(Long usuarioId, NivelEducativo nivel) {
        if (!usuarioRepo.existsById(usuarioId)) {
            throw new RuntimeException("Usuario no encontrado con id: " + usuarioId);
        }
        if (nivel == null) {
            throw new IllegalArgumentException("Nivel educativo requerido");
        }
        return estudioRepo.findByUsuarioIdAndNivelEducativo(usuarioId, nivel);
    }

    public List<Estudio> listarTodos() {
        return estudioRepo.findAll();
    }

    // ===== UPDATE =====
    public Estudio actualizarEstudio(Long id, Estudio estudioActualizado, Long usuarioIdActual) {
        Estudio existente = obtenerPorId(id);

        // Validar que el usuario actual es el dueño o ADMIN
        if (!puedeModificarEstudio(existente, usuarioIdActual)) {
            throw new IllegalStateException("Solo el dueño o un administrador pueden actualizar este estudio");
        }

        // Actualizar campos permitidos
        existente.setTitulo(estudioActualizado.getTitulo());
        existente.setInstitucion(estudioActualizado.getInstitucion());
        existente.setFechaInicio(estudioActualizado.getFechaInicio());
        existente.setFechaFin(estudioActualizado.getFechaFin());
        existente.setEnCurso(estudioActualizado.getEnCurso());
        existente.setNivelEducativo(estudioActualizado.getNivelEducativo());
        existente.setModalidad(estudioActualizado.getModalidad());
        existente.setDescripcion(estudioActualizado.getDescripcion());
        existente.setCertificadoUrl(estudioActualizado.getCertificadoUrl());

        if (estudioActualizado.getMunicipio() != null) {
            municipioRepo.findById(estudioActualizado.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
            existente.setMunicipio(estudioActualizado.getMunicipio());
        }

        return estudioRepo.save(existente);
    }

    // ===== DELETE =====
    public void eliminarEstudio(Long id, Long usuarioIdActual) {
        Estudio existente = obtenerPorId(id);

        // Validar que el usuario actual es el dueño o ADMIN
        if (!puedeModificarEstudio(existente, usuarioIdActual)) {
            throw new IllegalStateException("Solo el dueño o un administrador pueden eliminar este estudio");
        }

        existente.setEstadoEstudio(Estudio.EstadoEstudio.INACTIVO);
        estudioRepo.save(existente);
    }

    // ===== ELIMINACIÓN FÍSICA (solo ADMIN) =====
    // @PreAuthorize("hasRole('ADMIN')") en controller
    public void eliminarEstudioFisico(Long id) {
        // Verificar que el estudio existe
        if (!estudioRepo.existsById(id)) {
            throw new RuntimeException("Estudio no encontrado con id: " + id);
        }

        // Eliminación física
        estudioRepo.deleteById(id);
    }

    private boolean puedeModificarEstudio(Estudio estudio, Long usuarioId) {
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Es el dueño o es ADMIN
        return estudio.getUsuario().getId().equals(usuarioId) || 
               usuario.getRol() == Usuario.Rol.ADMIN;
    }
}
