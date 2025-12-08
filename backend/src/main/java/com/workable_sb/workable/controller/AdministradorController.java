package com.workable_sb.workable.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.workable_sb.workable.models.Administrador;
import com.workable_sb.workable.service.AdministradorService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/administrador")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    // ===== CREATE =====
    @PostMapping
    public ResponseEntity<?> crearAdministrador(@RequestBody Administrador administrador) {
        try {
            Administrador nuevoAdministrador = administradorService.crearAdministrador(administrador);
            return ResponseEntity.status(201).body(nuevoAdministrador);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear administrador: " + e.getMessage()));
        }
    }

    // ===== READ =====
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerAdministrador(@PathVariable Long id) {
        try {
            Administrador administrador = administradorService.obtenerPorId(id);
            return ResponseEntity.ok(administrador);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener administrador: " + e.getMessage()));
        }
    }

    // Obtener por correo
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/correo/{correo}")
    public ResponseEntity<?> obtenerPorCorreo(@PathVariable String correo) {
        try {
            Administrador administrador = administradorService.obtenerPorCorreo(correo);
            return ResponseEntity.ok(administrador);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener administrador: " + e.getMessage()));
        }
    }

    // Obtener todos
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> obtenerTodos() {
        try {
            List<Administrador> administradores = administradorService.obtenerTodos();
            return ResponseEntity.ok(administradores);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener administradores: " + e.getMessage()));
        }
    }

    // Obtener administradores activos
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/activos")
    public ResponseEntity<?> obtenerActivos() {
        try {
            List<Administrador> administradores = administradorService.obtenerActivos();
            return ResponseEntity.ok(administradores);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener administradores: " + e.getMessage()));
        }
    }

    // ===== UPDATE =====
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarAdministrador(@PathVariable Long id, @RequestBody Administrador administrador) {
        try {
            Administrador administradorActualizado = administradorService.actualizar(id, administrador);
            return ResponseEntity.ok(administradorActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar administrador: " + e.getMessage()));
        }
    }

    // ===== DELETE =====
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAdministrador(@PathVariable Long id) {
        try {
            administradorService.eliminarAdministrador(id);
            return ResponseEntity.status(204).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar administrador: " + e.getMessage()));
        }
    }

    // ===== ACTUALIZAR ÚLTIMO ACCESO =====
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/ultimo-acceso")
    public ResponseEntity<?> actualizarUltimoAcceso(@PathVariable Long id) {
        try {
            administradorService.actualizarUltimoAcceso(id);
            return ResponseEntity.ok(Map.of("mensaje", "Último acceso actualizado"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar último acceso: " + e.getMessage()));
        }
    }
}
