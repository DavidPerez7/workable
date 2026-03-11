

package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Oferta.EstadoOferta;
import com.workable_sb.workable.service.OfertaService;
import com.workable_sb.workable.dto.OfertaSearchDTO;
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
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PostMapping
    public ResponseEntity<?> criarOferta(@RequestBody Oferta oferta) {
        try {
            Oferta nuevaOferta = ofertaService.create(oferta);
            return ResponseEntity.status(201).body(nuevaOferta);
        } catch (IllegalArgumentException e) {
            System.err.println("Validation error: " + e.getMessage());
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear oferta: " + e.getMessage()));
        }
    }

    // READ
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN', 'ASPIRANTE')")
    @GetMapping
    public ResponseEntity<?> listarTodas() {
        try {
            List<Oferta> ofertas = ofertaService.getAll();
            return ResponseEntity.ok(ofertas);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener ofertas: " + e.getMessage()));
        }
    }

    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN', 'ASPIRANTE')")
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            Oferta oferta = ofertaService.getById(id);
            return ResponseEntity.ok(oferta);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // BÚSQUEDA UNIFICADA CON FILTROS COMBINABLES
    @PostMapping("/search")
    public ResponseEntity<?> search(@RequestBody OfertaSearchDTO filtros) {
        try {
            List<Oferta> ofertas = ofertaService.buscarConFiltros(filtros);
            return ResponseEntity.ok(ofertas);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error en búsqueda: " + e.getMessage()));
        }
    }

    // UPDATE
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarOferta(@PathVariable Long id, @RequestBody Oferta oferta) {
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

    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable Long id,
            @RequestParam String estado) {
        try {
            EstadoOferta estadoEnum = EstadoOferta.valueOf(estado.toUpperCase());
            Oferta ofertaActualizada = ofertaService.updateEstado(id, estadoEnum);
            return ResponseEntity.ok(ofertaActualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", "Estado inválido: " + estado));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error: " + e.getMessage()));
        }
    }

    // DELETE
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarOferta(@PathVariable Long id) {
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


