package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.service.AspiranteService;
import com.workable_sb.workable.security.CustomUserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/aspirante")
public class AspiranteController {

    @Autowired
    private AspiranteService aspiranteService;

    // - CREATE (PUBLICO: registro de aspirantes)
    @PostMapping("/public")
    public ResponseEntity<Aspirante> createPublic(@RequestBody Aspirante aspirante) {
        return ResponseEntity.ok(aspiranteService.createPublic(aspirante));
    }

    // - CREATE (ADMIN)
    @PostMapping
    public ResponseEntity<Aspirante> create(@RequestBody Aspirante aspirante) {
        return ResponseEntity.ok(aspiranteService.create(aspirante));
    }

    // - READ all
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN', 'ADSO')")
    @GetMapping
    public ResponseEntity<List<Aspirante>> getAll() {
        return ResponseEntity.ok(aspiranteService.getAll());
    }

    // - READ my profile (using JWT authentication)
    @PreAuthorize("hasRole('ASPIRANTE')")
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal CustomUserDetails user) {
        try {
            Long usuarioId = user.getUsuarioId();
            Optional<Aspirante> aspirante = aspiranteService.getById(usuarioId);
            if (aspirante.isPresent()) {
                return ResponseEntity.ok(aspirante.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener perfil: " + e.getMessage());
        }
    }

    // - UPDATE my profile (using JWT authentication)
    @PreAuthorize("hasRole('ASPIRANTE')")
    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarMiPerfil(@RequestBody Aspirante aspirante, @AuthenticationPrincipal CustomUserDetails user) {
        try {
            Long usuarioId = user.getUsuarioId();
            return ResponseEntity.ok(aspiranteService.updateMiPerfil(usuarioId, aspirante));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al actualizar perfil: " + e.getMessage());
        }
    }

    // - READ by correo
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN', 'ADSO')")
    @GetMapping("/correo")
    public ResponseEntity<Optional<Aspirante>> getByCorreo(@RequestParam String correo) {
        return ResponseEntity.ok(aspiranteService.getByCorreo(correo));
    }

    // - READ by nombre
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN', 'ADSO')")
    @GetMapping("/nombre")
    public ResponseEntity<Optional<Aspirante>> getByNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(aspiranteService.getByNombre(nombre));
    }

    // - READ PUBLIC by id (para perfil)
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN', 'ADSO')")
    @GetMapping("/public/{id}")
    public ResponseEntity<?> getByIdPublic(@PathVariable Long id) {
        Optional<Aspirante> optional = aspiranteService.getById(id);
        
        if (optional.isPresent()) {
            return ResponseEntity.ok(optional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // - UPDATE (PUBLICO: solo el propio aspirante)
    @PutMapping("/public/{id}")
    public ResponseEntity<Aspirante> updatePublic(@PathVariable Long id, @RequestBody Aspirante aspirante, @RequestParam Long aspiranteActualId) {
        return ResponseEntity.ok(aspiranteService.updatePublic(id, aspirante, aspiranteActualId));
    }

    // - UPDATE Mi Perfil (para aspirantes editando su propio perfil - PROTEGIDO)
    @PreAuthorize("hasRole('ASPIRANTE')")
    @PutMapping("/{id}")
    public ResponseEntity<Aspirante> updateMiPerfil(@PathVariable Long id, @RequestBody Aspirante aspirante) {
        return ResponseEntity.ok(aspiranteService.updateMiPerfil(id, aspirante));
    }

    // - UPDATE (ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/admin")
    public ResponseEntity<Aspirante> update(@PathVariable Long id, @RequestBody Aspirante aspirante) {
        return ResponseEntity.ok(aspiranteService.update(id, aspirante));
    }

    // - DESACTIVAR (ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<Aspirante> desactivar(@PathVariable Long id) {
        Aspirante aspirante = aspiranteService.getById(id)
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));
        aspirante.setIsActive(false);
        return ResponseEntity.ok(aspiranteService.update(id, aspirante));
    }

    // - ACTIVAR (ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/activar")
    public ResponseEntity<Aspirante> activar(@PathVariable Long id) {
        Aspirante aspirante = aspiranteService.getById(id)
                .orElseThrow(() -> new RuntimeException("Aspirante no encontrado"));
        aspirante.setIsActive(true);
        return ResponseEntity.ok(aspiranteService.update(id, aspirante));
    }

    // - DELETE PUBLICO: solo el propio aspirante
    @DeleteMapping("/publicDelete/{id}")
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN')")
    public ResponseEntity<Void> deletePublic(@PathVariable Long id) {
        aspiranteService.deletePublic(id);
        return ResponseEntity.noContent().build();
    }

    // - DELETE (ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        aspiranteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}