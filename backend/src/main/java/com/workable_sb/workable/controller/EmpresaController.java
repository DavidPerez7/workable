package com.workable_sb.workable.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.service.EmpresaService;
import com.workable_sb.workable.security.CustomUserDetails;

@RestController
@RequestMapping("/api/empresa")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;
    // ===== CONTROLLER REDUCIDO: solo los 5 métodos requeridos =====

    // - GET all
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<Empresa>> getAll() {
        return ResponseEntity.ok(empresaService.getAll());
    }

    // - GET by id
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Empresa> getById(@PathVariable Long id) {
        Empresa empresa = empresaService.getById(id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con id: " + id));
        return ResponseEntity.ok(empresa);
    }

    // - CREATE
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PostMapping
    public ResponseEntity<Empresa> create(@RequestBody Empresa empresa, @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(empresaService.create(empresa, user.getUsuarioId()));
    }

    // - UPDATE
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Empresa> update(@PathVariable Long id, @RequestBody Empresa empresa, @AuthenticationPrincipal CustomUserDetails user) {
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return ResponseEntity.ok(empresaService.updateAdmin(id, empresa));
        } else {
            return ResponseEntity.ok(empresaService.update(id, empresa, user.getUsuarioId()));
        }
    }

    // - DELETE
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails user) {
        // If authentication principal is missing, return 401
        if (user == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }

        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        try {
            if (isAdmin) {
                empresaService.deleteAdmin(id);
            } else {
                empresaService.delete(id, user.getUsuarioId());
            }
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            // e.g., user not allowed to delete
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
        } catch (RuntimeException e) {
            // Could be "Empresa not found" or other runtime exceptions -> return 404
            return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND).build();
        }
    }
}
