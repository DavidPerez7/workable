
package com.workable_sb.workable.controller.oferta;

import com.workable_sb.workable.dto.oferta.OfertaModalidadCreateDTO;
import com.workable_sb.workable.models.OfertaModalidad;
import com.workable_sb.workable.service.oferta.OfertaModalidadService;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/modalidad")
public class OfertaModalidadController {
    private final OfertaModalidadService service;

    public OfertaModalidadController(OfertaModalidadService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<OfertaModalidad>> listarModalidades() {
        return ResponseEntity.ok(service.listarModalidades());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfertaModalidad> obtenerModalidad(@PathVariable Integer id) {
        return service.obtenerModalidad(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OfertaModalidad> crearModalidad(@Valid @RequestBody OfertaModalidadCreateDTO dto) {
        OfertaModalidad creada = service.crearModalidad(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OfertaModalidad> actualizarModalidad(@PathVariable Integer id, @Valid @RequestBody OfertaModalidadCreateDTO dto) {
        return service.actualizarModalidad(id, dto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarModalidad(@PathVariable Integer id) {
        boolean eliminado = service.eliminarModalidad(id);
        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<OfertaModalidad> actualizarEstado(@PathVariable Integer id, @RequestParam("estado") String estadoStr) {
        try {
            OfertaModalidad.EstadoModalidad estado = OfertaModalidad.EstadoModalidad.valueOf(estadoStr.toUpperCase());
            return service.actualizarEstado(id, estado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
