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

    // ===== CREATE (Solo ADMIN) =====
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody HojaVida hojaVida) {
        try {
            HojaVida creada = hojaVidaService.crearHojaVidaManual(hojaVida);
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

    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/aspirante/{aspiranteId}")
    public ResponseEntity<?> obtenerPorAspirante(@PathVariable Long aspiranteId) {
        try {
            HojaVida hojaVida = hojaVidaService.obtenerHojaVidaPorAspirante(aspiranteId);
            return ResponseEntity.ok(hojaVida);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener hoja de vida: " + e.getMessage()));
        }
    }

    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping
    public ResponseEntity<?> obtenerTodas() {
        try {
            List<HojaVida> hojasVida = hojaVidaService.obtenerTodasLasHojasVida();
            return ResponseEntity.ok(hojasVida);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener hojas de vida: " + e.getMessage()));
        }
    }

    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/publicas/todas")
    public ResponseEntity<?> obtenerPublicas() {
        try {
            List<HojaVida> hojasVida = hojaVidaService.obtenerHojasVidaPublicas();
            return ResponseEntity.ok(hojasVida);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener hojas de vida públicas: " + e.getMessage()));
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

    // ===== DELETE =====
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'ADMIN')")
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
