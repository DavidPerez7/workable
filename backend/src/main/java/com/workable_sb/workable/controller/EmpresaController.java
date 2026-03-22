package com.workable_sb.workable.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.repository.AspiranteRepo;
import com.workable_sb.workable.service.EmpresaService;
import com.workable_sb.workable.models.Empresa;

@RestController
@RequestMapping("/api/empresa")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @Autowired
    private AspiranteRepo aspiranteRepo;

    // CREATE
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Empresa empresa) {
        try {
            Empresa created = empresaService.create(empresa, null);
            return ResponseEntity.status(201).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // READ ALL
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Empresa> empresas = empresaService.getAll();
            return ResponseEntity.ok(empresas);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Empresa empresa = empresaService.getById(id);
            return ResponseEntity.ok(empresa);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // UPDATE
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Empresa empresa) {
        try {
            Empresa updated = empresaService.update(id, empresa);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // DELETE
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            empresaService.delete(id);
            return ResponseEntity.status(204).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // PUNTUAR EMPRESA
    @PreAuthorize("hasRole('ASPIRANTE')")
    @PostMapping("/{empresaId}/puntuar")
    public ResponseEntity<?> puntuarEmpresa(@PathVariable Long empresaId, @RequestBody Map<String, Float> body) {
        try {
            Float puntuacion = body.get("puntuacion");
            if (puntuacion == null) {
                return ResponseEntity.status(400).body(Map.of("error", "Puntuación requerida"));
            }

            // Obtener aspiranteId del token (simplificado, asumir que se implementa)
            Long aspiranteId = getCurrentUserId(); // Método a implementar

            empresaService.puntuarEmpresa(empresaId, aspiranteId, puntuacion);
            return ResponseEntity.ok(Map.of("message", "Puntuación registrada"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // Método auxiliar para obtener ID del usuario autenticado
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuario no autenticado");
        }
        String correo = authentication.getName();
        Aspirante aspirante = aspiranteRepo.findByCorreo(correo)
            .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));
        return aspirante.getId();
    }
}