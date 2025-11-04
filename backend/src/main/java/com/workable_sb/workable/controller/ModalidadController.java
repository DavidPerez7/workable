
package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Modalidad;
import com.workable_sb.workable.dto.ModalidadCreateDTO;
import com.workable_sb.workable.service.ModalidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/modalidad")
public class ModalidadController {
    @Autowired
    private ModalidadService modalidadService;

    @GetMapping
    public ResponseEntity<List<Modalidad>> listarModalidades() {
        return ResponseEntity.ok(modalidadService.listarModalidades());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Modalidad> obtenerModalidad(@PathVariable Integer id) {
        return modalidadService.obtenerModalidad(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Modalidad> crearModalidad(@Valid @RequestBody ModalidadCreateDTO dto) {
        Modalidad creada = modalidadService.crearModalidad(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Modalidad> actualizarModalidad(@PathVariable Integer id, @Valid @RequestBody ModalidadCreateDTO dto) {
        return modalidadService.actualizarModalidad(id, dto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarModalidad(@PathVariable Integer id) {
        boolean eliminado = modalidadService.eliminarModalidad(id);
        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Modalidad> actualizarEstado(@PathVariable Integer id, @RequestParam("estado") String estadoStr) {
        try {
            Modalidad.EstadoModalidad estado = Modalidad.EstadoModalidad.valueOf(estadoStr.toUpperCase());
            return modalidadService.actualizarEstado(id, estado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
