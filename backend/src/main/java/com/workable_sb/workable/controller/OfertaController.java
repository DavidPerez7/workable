

package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.dto.OfertaSearchDTO;
import com.workable_sb.workable.service.OfertaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/oferta")
public class OfertaController {

    @Autowired
    private OfertaService ofertaService;

    // CREATE
    @PreAuthorize("hasAnyRole('ADMIN', 'RECLUTADOR')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Oferta oferta) {
        try {
            Oferta nuevaOferta = ofertaService.create(oferta);
            return ResponseEntity.status(201).body(nuevaOferta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear oferta: " + e.getMessage()));
        }
    }

    // READ ALL
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Oferta> ofertas = ofertaService.getAll();
            return ResponseEntity.ok(ofertas);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener ofertas: " + e.getMessage()));
        }
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Oferta oferta = ofertaService.getById(id);
            return ResponseEntity.ok(oferta);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // READ BY EMPRESA
    @PreAuthorize("hasAnyRole('ADMIN', 'RECLUTADOR')")
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<?> getByEmpresaId(@PathVariable Long empresaId) {
        try {
            List<Oferta> ofertas = ofertaService.getByEmpresaId(empresaId);
            return ResponseEntity.ok(ofertas);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener ofertas por empresa: " + e.getMessage()));
        }
    }

    // SEARCH - BÚSQUEDA CON FILTROS (ADMIN y ASPIRANTE)
    @PreAuthorize("hasAnyRole('ADMIN', 'ASPIRANTE')")
    @PostMapping("/search")
    public ResponseEntity<?> search(@RequestBody OfertaSearchDTO criteria) {
        try {
            List<Oferta> ofertas = ofertaService.search(criteria);
            return ResponseEntity.ok(ofertas);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error en búsqueda: " + e.getMessage()));
        }
    }

    // UPDATE
    @PreAuthorize("hasAnyRole('ADMIN', 'RECLUTADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Oferta oferta) {
        try {
            Oferta ofertaActualizada = ofertaService.update(id, oferta);
            return ResponseEntity.ok(ofertaActualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // DELETE
    @PreAuthorize("hasAnyRole('ADMIN', 'RECLUTADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            ofertaService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }
}


