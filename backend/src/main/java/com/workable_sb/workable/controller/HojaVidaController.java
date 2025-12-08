package com.workable_sb.workable.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.workable_sb.workable.models.HojaVida;
import com.workable_sb.workable.service.HojaVidaService;

@RestController
@RequestMapping("/api/hoja-vida")
public class HojaVidaController {

    @Autowired
    private HojaVidaService hojaVidaService;

    // ===== CREATE =====
    @PreAuthorize("hasRole('ASPIRANTE')")
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody HojaVida hojaVida, @RequestParam Long usuarioId, @RequestParam Long usuarioIdActual) {
        try {
            // Validar que el usuario solo puede crear su propia hoja de vida
            if (!usuarioId.equals(usuarioIdActual)) {
                return ResponseEntity.status(403).body(Map.of("error", "No puedes crear hoja de vida para otro usuario"));
            }
            HojaVida creada = hojaVidaService.crearHojaVida(hojaVida, usuarioId);
            return ResponseEntity.ok(creada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear hoja de vida: " + e.getMessage()));
        }
    }

    // ===== READ =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            HojaVida hojaVida = hojaVidaService.obtenerPorId(id);
            return ResponseEntity.ok(hojaVida);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener hoja de vida: " + e.getMessage()));
        }
    }

    // Obtener hoja de vida completa con todos los datos
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}/completa")
    public ResponseEntity<?> obtenerCompleta(@PathVariable Long id) {
        try {
            HojaVida hojaVida = hojaVidaService.obtenerPorId(id);
            return ResponseEntity.ok(hojaVida);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener hoja de vida completa: " + e.getMessage()));
        }
    }

    // Obtener hoja de vida completa por usuario
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}/completa")
    public ResponseEntity<?> obtenerCompletaPorUsuario(@PathVariable Long usuarioId) {
        try {
            HojaVida hojaVida = hojaVidaService.obtenerHojaVidaPorAspirante(usuarioId);
            return ResponseEntity.ok(hojaVida);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener hoja de vida: " + e.getMessage()));
        }
    }

    // Obtener todas las hojas de vida de un usuario
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> obtenerPorUsuario(@PathVariable Long usuarioId) {
        try {
            List<HojaVida> hojasVida = hojaVidaService.obtenerHojasVidaPorUsuario(usuarioId);
            return ResponseEntity.ok(hojasVida);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener hojas de vida: " + e.getMessage()));
        }
    }

    // Obtener hojas de vida públicas (para reclutadores)
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/publicas")
    public ResponseEntity<?> obtenerPublicas() {
        try {
            List<HojaVida> hojasVida = hojaVidaService.obtenerHojasVidaPublicas();
            return ResponseEntity.ok(hojasVida);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener hojas de vida públicas: " + e.getMessage()));
        }
    }

    // Obtener hojas de vida públicas completas
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/publicas/completas")
    public ResponseEntity<?> obtenerPublicasCompletas() {
        try {
            List<HojaVida> hojasVida = hojaVidaService.obtenerHojasVidaPublicas();
            return ResponseEntity.ok(hojasVida);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener hojas de vida: " + e.getMessage()));
        }
    }

    // Buscar por título
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorTitulo(@RequestParam String titulo) {
        try {
            List<HojaVida> hojasVida = hojaVidaService.buscarPorTitulo(titulo);
            return ResponseEntity.ok(hojasVida);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al buscar hojas de vida: " + e.getMessage()));
        }
    }

    // ===== UPDATE =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody HojaVida hojaVida, @RequestParam Long usuarioIdActual) {
        try {
            HojaVida actualizada = hojaVidaService.actualizarHojaVida(id, hojaVida, usuarioIdActual);
            return ResponseEntity.ok(actualizada);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar hoja de vida: " + e.getMessage()));
        }
    }

    // Cambiar visibilidad (pública/privada)
    @PreAuthorize("hasRole('ASPIRANTE')")
    @PatchMapping("/{id}/visibilidad")
    public ResponseEntity<?> cambiarVisibilidad(@PathVariable Long id, @RequestParam Boolean esPublica, @RequestParam Long usuarioIdActual) {
        try {
            HojaVida actualizada = hojaVidaService.cambiarVisibilidad(id, esPublica, usuarioIdActual);
            return ResponseEntity.ok(actualizada);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al cambiar visibilidad: " + e.getMessage()));
        }
    }

    // Desactivar
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        try {
            hojaVidaService.desactivarHojaVida(id, usuarioIdActual);
            return ResponseEntity.ok(Map.of("message", "Hoja de vida desactivada correctamente"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al desactivar: " + e.getMessage()));
        }
    }

    // ===== DELETE =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        try {
            hojaVidaService.eliminarHojaVida(id, usuarioIdActual);
            return ResponseEntity.ok(Map.of("message", "Hoja de vida eliminada correctamente"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar: " + e.getMessage()));
        }
    }
}
