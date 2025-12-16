

package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.service.OfertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/oferta")
public class OfertaController {

    @Autowired
    private OfertaService ofertaService;

    // CREATE
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PostMapping
    public ResponseEntity<Oferta> criarOferta(@RequestBody Oferta oferta) {
        return ResponseEntity.ok(ofertaService.create(oferta));
    }

    // GET ALL
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN', 'ASPIRANTE')")
    @GetMapping
    public ResponseEntity<List<Oferta>> listarTodas() {
        return ResponseEntity.ok(ofertaService.getAll());
    }

    // GET BY ID
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN', 'ASPIRANTE')")
    @GetMapping("/{id}")
    public ResponseEntity<Oferta> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ofertaService.getById(id));
    }

    // UPDATE
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Oferta> actualizarOferta(@PathVariable Long id, @RequestBody Oferta oferta) {
        return ResponseEntity.ok(ofertaService.update(id, oferta));
    }

    // DELETE
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarOferta(@PathVariable Long id) {
        ofertaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

