package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Notificacion;
import com.workable_sb.workable.service.NotificacionService;
import com.workable_sb.workable.security.CustomUserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificacion")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    // ===== READ notificaciones del aspirante actual =====
    @PreAuthorize("hasRole('ASPIRANTE')")
    @GetMapping("/aspirante")
    public ResponseEntity<?> getNotificacionesAspirante() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = null;
            
            if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
                CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                usuarioId = userDetails.getUsuarioId();
            }
            
            if (usuarioId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "No se pudo obtener el usuario del token"));
            }
            
            return ResponseEntity.ok(notificacionService.getByUsuario(usuarioId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== UPDATE marcar como leída (PUT) =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @PutMapping("/{id}/marcar-leida")
    public ResponseEntity<?> marcarComoLeidaPut(@PathVariable Long id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long usuarioId = null;
            
            if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
                CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                usuarioId = userDetails.getUsuarioId();
            }
            
            if (usuarioId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "No se pudo obtener el usuario del token"));
            }
            
            return ResponseEntity.ok(notificacionService.marcarComoLeida(id, usuarioId));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== CREATE (Solo ADMIN para crear notificaciones de sistema) =====
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Notificacion request) {
        try {
            return ResponseEntity.ok(notificacionService.create(request));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear notificacion: " + e.getMessage()));
        }
    }

    // ===== READ by id =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(notificacionService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== READ by usuario (Aspirante o Reclutador) =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> getByUsuario(@PathVariable Long usuarioId, @RequestParam Long usuarioIdActual) {
        try {
            if (!usuarioId.equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes ver notificaciones de otro usuario"));
            }
            return ResponseEntity.ok(notificacionService.getByUsuario(usuarioId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== READ todas las notificaciones =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(notificacionService.getAll());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== READ by usuario and leida =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}/leida")
    public ResponseEntity<?> getByUsuarioAndLeida(@PathVariable Long usuarioId, @RequestParam Boolean leida, @RequestParam Long usuarioIdActual) {
        try {
            if (!usuarioId.equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No tienes permisos"));
            }
            return ResponseEntity.ok(notificacionService.getByUsuarioAndLeida(usuarioId, leida));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== READ by usuario and tipo =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}/tipo")
    public ResponseEntity<?> getByUsuarioAndTipo(@PathVariable Long usuarioId, @RequestParam Notificacion.Tipo tipo, @RequestParam Long usuarioIdActual) {
        try {
            if (!usuarioId.equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No tienes permisos"));
            }
            return ResponseEntity.ok(notificacionService.getByUsuarioAndTipo(usuarioId, tipo));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== READ activas by usuario =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}/activas")
    public ResponseEntity<?> getActivasByUsuario(@PathVariable Long usuarioId, @RequestParam Long usuarioIdActual) {
        try {
            if (!usuarioId.equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No tienes permisos"));
            }
            return ResponseEntity.ok(notificacionService.getActivasByUsuario(usuarioId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== READ contar no leidas =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}/no-leidas")
    public ResponseEntity<?> contarNoLeidas(@PathVariable Long usuarioId, @RequestParam Long usuarioIdActual) {
        try {
            if (!usuarioId.equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No tienes permisos"));
            }
            return ResponseEntity.ok(notificacionService.contarNoLeidas(usuarioId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== UPDATE (Solo ADMIN puede actualizar notificaciones) =====
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Notificacion request) {
        try {
            return ResponseEntity.ok(notificacionService.update(id, request, null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== PATCH marcar como leida =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @PatchMapping("/{id}/leida")
    public ResponseEntity<?> marcarComoLeida(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        try {
            return ResponseEntity.ok(notificacionService.marcarComoLeida(id, usuarioIdActual));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== PATCH marcar todas como leidas =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @PatchMapping("/usuario/{usuarioId}/leidas")
    public ResponseEntity<?> marcarTodasComoLeidas(@PathVariable Long usuarioId, @RequestParam Long usuarioIdActual) {
        try {
            if (!usuarioId.equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No tienes permisos"));
            }
            notificacionService.marcarTodasComoLeidas(usuarioId);
            return ResponseEntity.ok(Map.of("message", "Todas las notificaciones marcadas como leídas"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // ===== DELETE (Solo ADMIN puede eliminar) =====
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            notificacionService.delete(id, null);
            return ResponseEntity.ok(Map.of("message", "Notificacion eliminada correctamente"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
