package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.models.Experiencia.Estado;
import com.workable_sb.workable.repository.AspiranteRepo;
import com.workable_sb.workable.repository.ExperienciaRepo;
import com.workable_sb.workable.repository.MunicipioRepo;

@Service
@Transactional
public class ExperienciaService {

    @Autowired
    private ExperienciaRepo experienciaRepo;

    @Autowired
    private AspiranteRepo aspiranteRepo;

    @Autowired
    private MunicipioRepo municipioRepo;

    // ===== CREATE =====
    public Experiencia crearExperiencia(Experiencia experiencia, Long aspiranteId) {

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

        // Validar que el aspirante existe
        Aspirante aspirante = aspiranteRepo.findById(aspiranteId)
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));

        // Validar municipio
        if (experiencia.getMunicipio() != null) {
            municipioRepo.findById(experiencia.getMunicipio().getId())
                    .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
        }

        experiencia.setAspirante(aspirante);

        return experienciaRepo.save(experiencia);
    }

    // ===== READ =====
    public Experiencia obtenerPorId(Long id) {
        return experienciaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Experiencia no encontrada con id: " + id));
    }

    public List<Experiencia> obtenerExperienciasPorUsuario(Long aspiranteId) {
        // Validar que el aspirante existe
        if (!aspiranteRepo.existsById(aspiranteId)) {
            throw new RuntimeException("Aspirante no encontrado con id: " + aspiranteId);
        }
        return experienciaRepo.findByAspiranteId(aspiranteId);
    }

    public List<Experiencia> obtenerExperienciasActivas(Long aspiranteId) {
        if (!aspiranteRepo.existsById(aspiranteId)) {
            throw new RuntimeException("Aspirante no encontrado con id: " + aspiranteId);
        }
        return experienciaRepo.findByAspiranteIdAndEstado(aspiranteId, Estado.ACTIVO);
    }

    public List<Experiencia> obtenerExperienciasOrdenadasPorFecha(Long aspiranteId) {
        if (!aspiranteRepo.existsById(aspiranteId)) {
            throw new RuntimeException("Aspirante no encontrado con id: " + aspiranteId);
        }
        return experienciaRepo.findByAspiranteIdOrderByFechaInicioDesc(aspiranteId);
    }

    public List<Experiencia> listarTodas() {
        return experienciaRepo.findAll();
    }

    // ===== UPDATE =====
    public Experiencia actualizarExperiencia(Long id, Experiencia experienciaActualizada, Long aspiranteIdActual) {
        Experiencia existente = obtenerPorId(id);

        // Validar que el usuario actual es el dueño o ADMIN
        if (!puedeModificarExperiencia(existente, aspiranteIdActual)) {
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

        return experienciaRepo.save(existente);
    }

    // ===== DELETE =====
    public void eliminarExperiencia(Long id, Long aspiranteIdActual) {
        Experiencia existente = obtenerPorId(id);

        if (!puedeModificarExperiencia(existente, aspiranteIdActual)) {
            throw new IllegalStateException("Solo el dueño o un administrador pueden eliminar esta experiencia");
        }

        experienciaRepo.delete(existente);
    }

    public Experiencia cambiarEstado(Long id, Estado nuevoEstado, Long aspiranteIdActual) {
        Experiencia existente = obtenerPorId(id);

        // Validar que el usuario actual es el dueño o ADMIN
        if (!puedeModificarExperiencia(existente, aspiranteIdActual)) {
            throw new IllegalStateException("Solo el dueño o un administrador pueden cambiar el estado");
        }

        existente.setEstado(nuevoEstado);
        return experienciaRepo.save(existente);
    }

    // ===== MÉTODOS AUXILIARES =====
    private boolean puedeModificarExperiencia(Experiencia experiencia, Long aspiranteId) {
        // Es el dueño
        return experiencia.getAspirante().getId().equals(aspiranteId);
    }
}
