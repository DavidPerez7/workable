package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Estudio;
import com.workable_sb.workable.service.EstudioService;
import com.workable_sb.workable.security.CustomUserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estudio")
public class EstudioController {

    private static final Logger log = LoggerFactory.getLogger(EstudioController.class);

    @Autowired
    private EstudioService estudioService;

    // ===== CREATE - Solo ASPIRANTE y ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PostMapping
    public ResponseEntity<?> crearEstudio(@RequestBody Estudio estudio) {
        try {
            // Obtener usuarioId y rol desde CustomUserDetails
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            Long usuarioIdActual = null;
            boolean isAdmin = false;
            if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
                CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                usuarioIdActual = userDetails.getUsuarioId();
                isAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            }
            
            if (usuarioIdActual == null) {
                log.error("No se pudo obtener usuarioId del token");
                return ResponseEntity.status(401).body(Map.of("error", "No se pudo obtener el usuario del token"));
            }
            
            // Si el aspirante no viene en el request, usar el del token
            Long aspiranteId;
            if (estudio.getAspirante() == null || estudio.getAspirante().getId() == null) {
                aspiranteId = usuarioIdActual;
            } else {
                aspiranteId = estudio.getAspirante().getId();
            }
            
            // Validar que el usuario solo puede crear estudios para sí mismo (ADMIN puede crear para cualquiera)
            if (!isAdmin && !aspiranteId.equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes crear estudios para otro usuario"));
            }
            
            return ResponseEntity.ok(estudioService.crearEstudio(estudio, aspiranteId));
        } catch (Exception e) {
            log.error("Error al crear estudio", e);
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear estudio: " + e.getMessage()));
        }
    }

    // ===== READ by id - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Estudio> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(estudioService.obtenerPorId(id));
    }

    // ===== READ por usuario - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{aspiranteId}")
    public ResponseEntity<List<Estudio>> obtenerEstudiosPorUsuario(@PathVariable Long aspiranteId) {
        return ResponseEntity.ok(estudioService.obtenerEstudiosPorUsuario(aspiranteId));
    }

    // ===== READ en curso por usuario - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{aspiranteId}/encurso")
    public ResponseEntity<List<Estudio>> obtenerEstudiosEnCurso(@PathVariable Long aspiranteId) {
        return ResponseEntity.ok(estudioService.obtenerEstudiosEnCurso(aspiranteId));
    }

    // ===== READ por nivel educativo - Todos autenticados =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{aspiranteId}/nivel")
    public ResponseEntity<List<Estudio>> obtenerEstudiosPorNivel(@PathVariable Long aspiranteId, @RequestParam Estudio.NivelEducativo nivel) {
        return ResponseEntity.ok(estudioService.obtenerEstudiosPorNivel(aspiranteId, nivel));
    }

    // ===== READ todos - ADMIN solamente =====
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Estudio>> listarTodos() {
        return ResponseEntity.ok(estudioService.listarTodos());
    }

    // ===== READ estudios del aspirante autenticado =====
    @PreAuthorize("hasRole('ASPIRANTE')")
    @GetMapping("/aspirante")
    public ResponseEntity<?> obtenerMisEstudios(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Long aspiranteId = userDetails.getUsuarioId();
            List<Estudio> estudios = estudioService.obtenerEstudiosPorUsuario(aspiranteId);
            return ResponseEntity.ok(estudios);
        } catch (Exception e) {
            log.error("Error al obtener estudios", e);
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener estudios: " + e.getMessage()));
        }
    }

    // ===== UPDATE - Solo ASPIRANTE sus propios estudios o ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarEstudio(@PathVariable Long id, @RequestBody Estudio estudio) {
        try {
            // Obtener usuarioId y rol desde CustomUserDetails
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            Long usuarioIdActual = null;
            boolean isAdmin = false;
            if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
                CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                usuarioIdActual = userDetails.getUsuarioId();
                isAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            }
            
            if (usuarioIdActual == null) {
                return ResponseEntity.status(401).body(Map.of("error", "No se pudo obtener el usuario del token"));
            }
            
            Estudio estudioExistente = estudioService.obtenerPorId(id);
            
            // Validar ownership (ADMIN puede editar cualquier estudio)
            if (!isAdmin && !estudioExistente.getAspirante().getId().equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes editar estudios de otro usuario"));
            }
            
            return ResponseEntity.ok(estudioService.actualizarEstudio(id, estudio, estudioExistente.getAspirante().getId()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar estudio: " + e.getMessage()));
        }
    }

    // ===== DELETE - Solo ASPIRANTE sus propios estudios o ADMIN =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEstudio(@PathVariable Long id) {
        try {
            // Obtener usuarioId y rol desde CustomUserDetails
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            Long usuarioIdActual = null;
            boolean isAdmin = false;
            if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
                CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                usuarioIdActual = userDetails.getUsuarioId();
                isAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            }
            
            if (usuarioIdActual == null) {
                return ResponseEntity.status(401).body(Map.of("error", "No se pudo obtener el usuario del token"));
            }
            
            Estudio estudio = estudioService.obtenerPorId(id);
            
            // Validar ownership (ADMIN puede eliminar cualquier estudio)
            if (!isAdmin && !estudio.getAspirante().getId().equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes eliminar estudios de otro usuario"));
            }
            
            estudioService.eliminarEstudio(id, estudio.getAspirante().getId());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar estudio: " + e.getMessage()));
        }
    }
}