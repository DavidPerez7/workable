package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Direccion;
import com.workable_sb.workable.service.DireccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/direccion")
public class DireccionController {

    @Autowired
    private DireccionService direccionService;

    @PreAuthorize("hasAnyRole('ADMIN', 'ASPIRANTE', 'RECLUTADOR')")
    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Direccion direccion) {
        try {
            return ResponseEntity.ok(direccionService.crear(direccion));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear dirección: " + e.getMessage()));
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ASPIRANTE', 'RECLUTADOR')")
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(direccionService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener dirección: " + e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> listarTodas() {
        try {
            return ResponseEntity.ok(direccionService.listarTodas());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al listar direcciones: " + e.getMessage()));
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ASPIRANTE', 'RECLUTADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody Direccion direccion) {
        try {
            return ResponseEntity.ok(direccionService.actualizar(id, direccion));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar dirección: " + e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            direccionService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar dirección: " + e.getMessage()));
        }
    }
}
