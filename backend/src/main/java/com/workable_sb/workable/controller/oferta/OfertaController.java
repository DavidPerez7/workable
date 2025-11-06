package com.workable_sb.workable.controller.oferta;

import com.workable_sb.workable.dto.oferta.OfertaCreateDTO;
import com.workable_sb.workable.dto.oferta.OfertaReadDTO;
import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.service.oferta.OfertaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/oferta")
@RequiredArgsConstructor
public class OfertaController {
    private final OfertaService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<OfertaReadDTO> create(@Valid @RequestBody OfertaCreateDTO dto) {
        OfertaReadDTO created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<OfertaReadDTO> update(
            @PathVariable Integer id,
            @Valid @RequestBody OfertaCreateDTO dto) {
        OfertaReadDTO updated = service.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfertaReadDTO> findById(@PathVariable Integer id) {
        OfertaReadDTO oferta = service.findById(id);
        return ResponseEntity.ok(oferta);
    }

    @GetMapping
    public ResponseEntity<List<OfertaReadDTO>> findAll() {
        List<OfertaReadDTO> ofertas = service.findAll();
        return ResponseEntity.ok(ofertas);
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<OfertaReadDTO> changeEstado(
            @PathVariable Integer id,
            @RequestParam Oferta.EstadoOferta estado) {
        OfertaReadDTO updated = service.changeEstado(id, estado);
        return ResponseEntity.ok(updated);
    }
}
