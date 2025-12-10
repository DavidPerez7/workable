package com.workable_sb.workable.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.workable_sb.workable.models.Reclutador;
import com.workable_sb.workable.security.CustomUserDetails;
import com.workable_sb.workable.service.ReclutadorService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reclutador")
public class ReclutadorController {

    @Autowired
    private ReclutadorService reclutadorService;

    // ===== CREATE =====
    @PostMapping
    public ResponseEntity<?> crearReclutador(@RequestBody Reclutador reclutador) {
        try {
            Reclutador nuevoReclutador = reclutadorService.crearReclutador(reclutador);
            return ResponseEntity.status(201).body(nuevoReclutador);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear reclutador: " + e.getMessage()));
        }
    }

    // ===== READ =====
    
    // READ my profile (using JWT authentication)
    @PreAuthorize("hasRole('RECLUTADOR')")
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal CustomUserDetails user) {
        try {
            Long usuarioId = user.getUsuarioId();
            Reclutador reclutador = reclutadorService.obtenerPorId(usuarioId);
            return ResponseEntity.ok(reclutador);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener perfil: " + e.getMessage()));
        }
    }

    // READ by id
    public ResponseEntity<?> obtenerReclutador(@PathVariable Long id) {
        try {
            Reclutador reclutador = reclutadorService.obtenerPorId(id);
            return ResponseEntity.ok(reclutador);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener reclutador: " + e.getMessage()));
        }
    }

    // READ PUBLIC by id (para perfil)
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    @GetMapping("/public/{id}")
    public ResponseEntity<?> obtenerReclutadorPublic(@PathVariable Long id) {
        try {
            Reclutador reclutador = reclutadorService.obtenerPorId(id);
            return ResponseEntity.ok(reclutador);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener reclutador: " + e.getMessage()));
        }
    }

    // Obtener por correo
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/correo/{correo}")
    public ResponseEntity<?> obtenerPorCorreo(@PathVariable String correo) {
        try {
            Reclutador reclutador = reclutadorService.obtenerPorCorreo(correo);
            return ResponseEntity.ok(reclutador);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener reclutador: " + e.getMessage()));
        }
    }

    // Obtener todos
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> obtenerTodos() {
        try {
            List<Reclutador> reclutadores = reclutadorService.obtenerTodos();
            return ResponseEntity.ok(reclutadores);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener reclutadores: " + e.getMessage()));
        }
    }

    // Obtener reclutadores de una empresa
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<?> obtenerPorEmpresa(@PathVariable Long empresaId) {
        try {
            List<Reclutador> reclutadores = reclutadorService.obtenerPorEmpresa(empresaId);
            return ResponseEntity.ok(reclutadores);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener reclutadores: " + e.getMessage()));
        }
    }

    // ===== UPDATE =====
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarReclutador(@PathVariable Long id, @RequestBody Reclutador reclutador, @RequestParam Long reclutadorIdActual) {
        try {
            Reclutador reclutadorActualizado = reclutadorService.actualizar(id, reclutador, reclutadorIdActual);
            return ResponseEntity.ok(reclutadorActualizado);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar reclutador: " + e.getMessage()));
        }
    }

    // Actualizar (ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/{id}")
    public ResponseEntity<?> actualizarReclutadorAdmin(@PathVariable Long id, @RequestBody Reclutador reclutador) {
        try {
            Reclutador reclutadorActualizado = reclutadorService.update(id, reclutador);
            return ResponseEntity.ok(reclutadorActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar reclutador: " + e.getMessage()));
        }
    }

    // ===== DELETE =====
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarReclutador(@PathVariable Long id, @RequestParam Long reclutadorIdActual) {
        try {
            reclutadorService.eliminarReclutador(id, reclutadorIdActual);
            return ResponseEntity.status(204).build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar reclutador: " + e.getMessage()));
        }
    }
}
