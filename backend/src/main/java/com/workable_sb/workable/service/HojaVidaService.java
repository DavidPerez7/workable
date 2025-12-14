package com.workable_sb.workable.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.Estudio;
import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.models.HojaVida;
import com.workable_sb.workable.repository.AspiranteRepo;
import com.workable_sb.workable.repository.EstudioRepo;
import com.workable_sb.workable.repository.ExperienciaRepo;
import com.workable_sb.workable.repository.HojaVidaRepo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@Transactional
public class HojaVidaService {

    @Autowired
    private HojaVidaRepo hojaVidaRepo;

    @Autowired
    private AspiranteRepo aspiranteRepo;

    @Autowired
    private EstudioRepo estudioRepo;

    @Autowired
    private ExperienciaRepo experienciaRepo;

    // ===== CREATE (Manual, solo para ADMIN) =====
    public HojaVida crearHojaVidaManual(HojaVida hojaVida) {
        if (hojaVida.getAspirante() == null || hojaVida.getAspirante().getId() == null) {
            throw new IllegalArgumentException("El aspirante es requerido");
        }
        return hojaVidaRepo.save(hojaVida);
    }

    // ===== READ =====
    public HojaVida obtenerPorId(Long id) {
        HojaVida hoja = hojaVidaRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Hoja de vida no encontrada"));
        // Incluir estudios y experiencias en la respuesta
        populateRelated(hoja);
        return hoja;
    }

    public HojaVida obtenerHojaVidaPorAspirante(Long aspiranteId) {
        HojaVida hoja = hojaVidaRepo.findByAspiranteId(aspiranteId).stream().findFirst()
            .orElseGet(() -> {
                // Si no existe, crear una automáticamente
                Aspirante aspirante = aspiranteRepo.findById(aspiranteId)
                    .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));
                HojaVida nuevaHojaVida = new HojaVida();
                nuevaHojaVida.setAspirante(aspirante);
                nuevaHojaVida.setEsPublica(false);
                return hojaVidaRepo.save(nuevaHojaVida);
            });
        populateRelated(hoja);
        return hoja;
    }

    public List<HojaVida> obtenerTodasLasHojasVida() {
        return hojaVidaRepo.findAll();
    }

    public List<HojaVida> obtenerHojasVidaPublicas() {
        return hojaVidaRepo.findByEsPublicaTrue();
    }

    // ===== UPDATE =====
    public HojaVida actualizarHojaVida(Long id, HojaVida hojaVidaActualizada) {
        HojaVida existente = obtenerPorId(id);

        // Obtener usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Usuario no autenticado");
        }

        // Obtener detalles del usuario
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof com.workable_sb.workable.security.CustomUserDetails)) {
            throw new IllegalStateException("Usuario no válido");
        }

        com.workable_sb.workable.security.CustomUserDetails userDetails = (com.workable_sb.workable.security.CustomUserDetails) principal;
        Long usuarioIdActual = userDetails.getUsuarioId();
        String rol = userDetails.getAuthorities().stream()
            .map(auth -> auth.getAuthority().replace("ROLE_", ""))
            .findFirst().orElse("");

        // Validar permisos
        if ("ADMIN".equals(rol)) {
            // Admin puede actualizar cualquier hoja de vida
        } else if ("ASPIRANTE".equals(rol)) {
            // Aspirante solo puede actualizar su propia hoja de vida
            if (!existente.getAspirante().getId().equals(usuarioIdActual)) {
                throw new IllegalStateException("Solo el dueño puede actualizar esta hoja de vida");
            }
        } else {
            throw new IllegalStateException("Rol no autorizado para actualizar hoja de vida");
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
        // Nota: `salarioEsperado` fue removido del modelo. Si hace falta, usar
        // una entidad separada o un campo en Aspirante.
        if (hojaVidaActualizada.getIdiomas() != null) {
            existente.setIdiomas(hojaVidaActualizada.getIdiomas());
        }
        if (hojaVidaActualizada.getEsPublica() != null) {
            existente.setEsPublica(hojaVidaActualizada.getEsPublica());
        }

        HojaVida saved = hojaVidaRepo.save(existente);
        // Autogenerar y poblar relaciones para mantener consistencia
        autogenerarHojaVida(existente.getAspirante().getId());
        populateRelated(saved);
        return saved;
    }

    // ===== DELETE =====
    public void eliminarHojaVida(Long id) {
        HojaVida hojaVida = obtenerPorId(id);

        // Obtener usuario autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Usuario no autenticado");
        }

        // Obtener detalles del usuario
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof com.workable_sb.workable.security.CustomUserDetails)) {
            throw new IllegalStateException("Usuario no válido");
        }

        com.workable_sb.workable.security.CustomUserDetails userDetails = (com.workable_sb.workable.security.CustomUserDetails) principal;
        Long usuarioIdActual = userDetails.getUsuarioId();
        String rol = userDetails.getAuthorities().stream()
            .map(auth -> auth.getAuthority().replace("ROLE_", ""))
            .findFirst().orElse("");

        // Validar permisos
        if ("ADMIN".equals(rol)) {
            // Admin puede eliminar cualquier hoja de vida
        } else if ("ASPIRANTE".equals(rol)) {
            // Aspirante solo puede eliminar su propia hoja de vida
            if (!hojaVida.getAspirante().getId().equals(usuarioIdActual)) {
                throw new IllegalStateException("Solo el dueño puede eliminar esta hoja de vida");
            }
        } else {
            throw new IllegalStateException("Rol no autorizado para eliminar hoja de vida");
        }

        hojaVidaRepo.delete(hojaVida);
    }

    // ===== AUTOGENERAR HOJA DE VIDA =====
    public HojaVida autogenerarHojaVida(Long aspiranteId) {
        Aspirante aspirante = aspiranteRepo.findById(aspiranteId)
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));

        List<Estudio> estudios = estudioRepo.findByAspiranteId(aspiranteId);
        List<Experiencia> experiencias = experienciaRepo.findByAspiranteId(aspiranteId);

        // Buscar la hoja de vida existente (creada al registro)
        HojaVida hojaVida = hojaVidaRepo.findByAspiranteId(aspiranteId).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Hoja de vida no encontrada"));

        // Asignar las listas para que la Hoja de Vida incluya estudios y experiencias
        hojaVida.setEstudios(estudios);
        hojaVida.setExperiencias(experiencias);

        // Generar resumen profesional si no existe
        if (hojaVida.getResumenProfesional() == null || hojaVida.getResumenProfesional().isEmpty()) {
            StringBuilder resumen = new StringBuilder();
            resumen.append("Profesional con ");
            if (!experiencias.isEmpty()) {
                resumen.append(experiencias.size()).append(" experiencia(s) laboral(es). ");
            }
            if (!estudios.isEmpty()) {
                resumen.append("Formación académica en ").append(estudios.get(0).getTitulo()).append(".");
            }
            hojaVida.setResumenProfesional(resumen.toString());
        }

        return hojaVidaRepo.save(hojaVida);
    }

    // ---- Helpers ----
    private void populateRelated(HojaVida hoja) {
        if (hoja == null || hoja.getAspirante() == null || hoja.getAspirante().getId() == null) return;
        Long aspiranteId = hoja.getAspirante().getId();
        List<Estudio> estudios = estudioRepo.findByAspiranteId(aspiranteId);
        List<Experiencia> experiencias = experienciaRepo.findByAspiranteId(aspiranteId);
        hoja.setEstudios(estudios);
        hoja.setExperiencias(experiencias);
    }
}
